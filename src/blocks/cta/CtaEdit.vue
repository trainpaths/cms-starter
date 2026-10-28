<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAutoResize, useBlockText, type BlockInstance } from '@trainpaths/cms/editor'

const props = defineProps<{ block: BlockInstance }>()

// original = default language's value while translating (placeholder)
const { value: title, original: originalTitle } = useBlockText(() => props.block, 'title')
const { value: text, original: originalText } = useBlockText(() => props.block, 'text')
const { value: label, original: originalLabel } = useBlockText(() => props.block, 'label')
// palette colour on the block wrapper replaces the tint
const bgClass = computed(() => (props.block.attributes.backgroundColor ? '' : 'bg-primary/10'))
const textarea = ref<HTMLTextAreaElement | null>(null)
useAutoResize(textarea, text)
</script>

<template>
	<!-- same box as CtaView (edit/view parity); the link target is set in the settings panel -->
	<div class="p-16">
		<div
			class="flex flex-col items-start gap-12 rounded-lg p-24"
			:class="bgClass"
		>
			<input
				v-model="title"
				class="w-full border-none bg-transparent font-sans text-2xl font-bold text-gray-900 outline-hidden"
				:placeholder="originalTitle || 'Title'"
				data-testid="cta-title"
			/>
			<textarea
				ref="textarea"
				v-model="text"
				rows="1"
				class="w-full resize-none border-none bg-transparent font-sans text-base text-gray-700 outline-hidden"
				:placeholder="originalText || 'Text'"
			/>
			<input
				v-model="label"
				class="rounded-md border-none bg-primary px-16 py-8 font-sans text-sm font-medium text-white outline-hidden"
				:placeholder="originalLabel || 'Button label'"
			/>
		</div>
	</div>
</template>
