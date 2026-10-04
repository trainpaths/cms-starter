<script setup lang="ts">
import { SettingsSection, useBlockAttribute, type BlockInstance } from '@trainpaths/cms/editor'

const props = defineProps<{ block: BlockInstance }>()
const url = useBlockAttribute(() => props.block, 'url', '')
</script>

<template>
	<SettingsSection title="Button">
		<label class="field-label">
			Link
			<input
				v-model="url"
				class="input-field mt-4"
				placeholder="/contact or https://…"
			/>
		</label>
	</SettingsSection>
</template>
