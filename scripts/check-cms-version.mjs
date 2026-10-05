// The CMS frontend package and API image must be the same release: the @trainpaths/cms tag in package.json
// ("github:trainpaths/cms#vX.Y.Z&path:/frontend") must equal `ARG CMS_VERSION=X.Y.Z` in the Dockerfile.
import { readFileSync } from 'node:fs'

const spec = JSON.parse(readFileSync('package.json', 'utf8')).dependencies['@trainpaths/cms']
const image = readFileSync('Dockerfile', 'utf8').match(/^ARG CMS_VERSION=(\S+)/m)?.[1]

const pkg = spec.match(/#v([^&]+)/)?.[1]
if (!pkg || pkg !== image) {
	console.error(`@trainpaths/cms ${pkg ?? spec} != Dockerfile CMS_VERSION ${image}: bump both together`)
	process.exit(1)
}
console.log(`CMS ${pkg}`)
