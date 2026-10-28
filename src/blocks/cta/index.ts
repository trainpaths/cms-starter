import { defineBlock } from '@trainpaths/cms/editor'
import meta from './block.json'
import CtaEdit from './CtaEdit.vue'
import CtaIcon from './CtaIcon.vue'
import CtaSettings from './CtaSettings.vue'

/** Site block (same format as the CMS built-ins); the public view is `CtaView.vue`. */
export default defineBlock(meta, {
	icon: CtaIcon,
	attributes: {
		// differ per language (localized sites); url, width and colour are shared
		title: { type: 'string', default: '', translatable: true },
		text: { type: 'string', default: '', translatable: true },
		label: { type: 'string', default: '', translatable: true },
		url: { type: 'string', default: '' },
		blockWidth: { type: 'string', default: 'default' },
		backgroundColor: { type: 'string', default: '' },
	},
	edit: CtaEdit,
	settings: CtaSettings,
})
