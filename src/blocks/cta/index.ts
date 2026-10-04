import { defineBlock } from '@trainpaths/cms/editor'
import meta from './block.json'
import CtaEdit from './CtaEdit.vue'
import CtaIcon from './CtaIcon.vue'
import CtaSettings from './CtaSettings.vue'

/** Site block (same format as the CMS built-ins); the public view is `CtaView.vue`. */
export default defineBlock(meta, {
	icon: CtaIcon,
	attributes: {
		title: { type: 'string', default: '' },
		text: { type: 'string', default: '' },
		label: { type: 'string', default: '' },
		url: { type: 'string', default: '' },
		blockWidth: { type: 'string', default: 'default' },
	},
	edit: CtaEdit,
	settings: CtaSettings,
})
