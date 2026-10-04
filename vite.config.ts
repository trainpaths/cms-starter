import { defineConfig } from 'vite'
import { cms } from '@trainpaths/cms/vite'

// everything CMS-specific (vue, tailwind, html inputs, /api proxy, dev SSR, overrides) comes from cms()
export default defineConfig({
	plugins: [cms()],
})
