<script setup lang="ts">
import { ref } from 'vue'
import { useAutoResize, useBlockAttribute, type BlockInstance } from '@trainpaths/cms/editor'

const props = defineProps<{ block: BlockInstance }>()

const title = useBlockAttribute(() => props.block, 'title', '')
const text = useBlockAttribute(() => props.block, 'text', '')
const label = useBlockAttribute(() => props.block, 'label', '')
const textarea = ref<HTMLTextAreaElement | null>(null)
useAutoResize(textarea, text)
</script>

<template>
	<!-- same box as CtaView (edit/view parity); the link target is set in the settings panel -->
	<div class="p-16">
		<div class="flex flex-col items-start gap-12 rounded-lg bg-brand/10 p-24">
			<input
				v-model="title"
				class="w-full border-none bg-transparent font-sans text-2xl font-bold text-gray-900 outline-hidden"
				placeholder="Title"
				data-testid="cta-title"
			/>
			<textarea
				ref="textarea"
				v-model="text"
				rows="1"
				class="w-full resize-none border-none bg-transparent font-sans text-base text-gray-700 outline-hidden"
				placeholder="Text"
			/>
			<input
				v-model="label"
				class="rounded-md border-none bg-primary px-16 py-8 font-sans text-sm font-medium text-white outline-hidden"
				placeholder="Button label"
			/>
		</div>
	</div>
</template>
