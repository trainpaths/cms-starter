<script setup lang="ts">
import { computed } from 'vue'
import type { BlockInstance } from '@trainpaths/cms/site'

const props = defineProps<{ block: BlockInstance }>()
const url = computed(() => String(props.block.attributes.url ?? ''))
// palette colour on the block wrapper replaces the tint
const bgClass = computed(() => (props.block.attributes.backgroundColor ? '' : 'bg-primary/10'))
// same-site paths as router links (no full page load), anything else as a plain link
const internal = computed(() => url.value.startsWith('/') && !url.value.startsWith('//'))
</script>

<template>
	<div class="p-16">
		<div
			class="flex flex-col items-start gap-12 rounded-lg p-24"
			:class="bgClass"
			data-testid="cta"
		>
			<h2 class="m-0 font-sans text-2xl font-bold text-gray-900">{{ block.attributes.title }}</h2>
			<p
				v-if="block.attributes.text"
				class="m-0 whitespace-pre-line font-sans text-base text-gray-700"
			>
				{{ block.attributes.text }}
			</p>
			<component
				:is="internal ? 'RouterLink' : 'a'"
				v-if="block.attributes.label && url"
				v-bind="internal ? { to: url } : { href: url }"
				class="rounded-md bg-primary px-16 py-8 font-sans text-sm font-medium text-white no-underline hover:bg-primary-dark"
			>
				{{ block.attributes.label }}
			</component>
		</div>
	</div>
</template>
