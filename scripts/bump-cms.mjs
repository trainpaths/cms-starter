// Bumps the CMS to one release everywhere it is pinned: the @trainpaths/cms tag in package.json, `ARG CMS_VERSION`
// in the Dockerfile (API image) and @trainpaths/nb-ui (must equal the CMS's peer dependency at that tag).
// Then `pnpm install` + check-version, and prints the release notes to read before deploying.
//
//   pnpm bump-cms [X.Y.Z] [--no-install]     no version = latest release
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

const REPO = 'trainpaths/cms'
const IMAGE = 'ghcr.io/trainpaths/cms-api'

const args = process.argv.slice(2)
const install = !args.includes('--no-install')
const wanted = args.find((a) => !a.startsWith('--'))?.replace(/^v/, '')

function fail(msg) {
	console.error(`bump-cms: ${msg}`)
	process.exit(1)
}

const parse = (v) => v.split('.').map(Number)
const compare = (a, b) => {
	const [x, y] = [parse(a), parse(b)]
	return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]
}

if (wanted && !/^\d+\.\d+\.\d+$/.test(wanted)) fail(`"${wanted}" is not a version (X.Y.Z)`)

// release tags only (vX.Y.Z), oldest first
const tags = execFileSync('git', ['ls-remote', '--tags', '--refs', `https://github.com/${REPO}`], { encoding: 'utf8' })
	.split('\n')
	.map((l) => l.match(/refs\/tags\/v(\d+\.\d+\.\d+)$/)?.[1])
	.filter(Boolean)
	.sort(compare)
if (!tags.length) fail(`no release tags in ${REPO}`)

const target = wanted ?? tags.at(-1)
if (!tags.includes(target)) fail(`${REPO} has no tag v${target} (latest: v${tags.at(-1)})`)

let pkgText = readFileSync('package.json', 'utf8')
let dockerfile = readFileSync('Dockerfile', 'utf8')
const deps = JSON.parse(pkgText).dependencies
const spec = deps['@trainpaths/cms']
const local = spec.startsWith('file:')
const current = local ? null : spec.match(/#v([^&]+)/)?.[1]
const image = dockerfile.match(/^ARG CMS_VERSION=(\S+)/m)?.[1]
if (!image) fail('no `ARG CMS_VERSION=` in the Dockerfile')

if (!local && current === target && image === target) {
	console.log(`Already on CMS ${target}`)
	process.exit(0)
}
if (local) console.warn(`Replacing the local tarball (${spec}) with the git tag`)

// nb-ui must match the CMS's peer at that tag
const res = await fetch(`https://raw.githubusercontent.com/${REPO}/v${target}/frontend/package.json`)
if (!res.ok) fail(`can't read the CMS package.json at v${target} (${res.status})`)
const nbUi = (await res.json()).peerDependencies?.['@trainpaths/nb-ui']
if (!nbUi) fail(`CMS v${target} declares no @trainpaths/nb-ui peer`)

// API image: release CI may still be publishing it; no docker → can't check, carry on
try {
	execFileSync('docker', ['manifest', 'inspect', `${IMAGE}:${target}`], { stdio: 'ignore' })
} catch (e) {
	if (e.code === 'ENOENT') console.warn(`docker not found: not checking that ${IMAGE}:${target} exists`)
	else fail(`image ${IMAGE}:${target} not found (release still publishing?)`)
}

// string replace, keeps package.json formatting
const setDep = (text, name, value) =>
	text.replace(new RegExp(`("${name.replace('/', '\\/')}":\\s*)"[^"]*"`), `$1"${value}"`)
pkgText = setDep(pkgText, '@trainpaths/cms', `github:${REPO}#v${target}&path:/frontend`)
pkgText = setDep(pkgText, '@trainpaths/nb-ui', nbUi)
dockerfile = dockerfile.replace(/^ARG CMS_VERSION=\S+/m, `ARG CMS_VERSION=${target}`)
writeFileSync('package.json', pkgText)
writeFileSync('Dockerfile', dockerfile)

const from = current ?? image
const was = local ? `${spec} / image ${image}` : current === image ? from : `${current} / image ${image}`
console.log(`CMS ${was} → ${target} (package + API image), @trainpaths/nb-ui ${deps['@trainpaths/nb-ui']} → ${nbUi}`)

if (install) {
	execFileSync('pnpm', ['install'], { stdio: 'inherit' })
	execFileSync('pnpm', ['check-version'], { stdio: 'inherit' })
}

// release notes between the old and new version (downgrade: just the target)
const notes = tags.filter((t) => compare(t, from) > 0 && compare(t, target) <= 0)
const major = parse(target)[0] > parse(from)[0]
console.log(`
Read the release notes${major ? ' (BREAKING: new major version)' : ''}:
${(notes.length ? notes : [target]).map((t) => `  https://github.com/${REPO}/releases/tag/v${t}`).join('\n')}

Next: ${install ? '' : 'pnpm install, '}pnpm build (fix type errors in blocks/templates/overrides), back up the database
before deploying (the API migrates on start, no downgrade), commit: chore(dep): bump CMS to v${target}`)
