<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PageContent, addressLines, entryHref, entryText, filledEntries, type TemplateProps } from '@trainpaths/cms/site'

/**
 * Legal notice ("legal" in cms.config.json): the owner's intro blocks, then the details from Configuration (firm
 * name, contact, VAT ID, commercial register), so the notice stays in sync with the site config.
 */
const props = defineProps<TemplateProps>()
const { t } = useI18n()

const firmName = computed(() => props.config?.fields.firmName ?? '')
const contact = computed(() => filledEntries(props.config, 'contact'))
const legal = computed(() =>
	[
		{ label: t('siteConfig.fields.vatId'), value: props.config?.fields.vatId ?? '' },
		{ label: t('siteConfig.fields.register'), value: props.config?.fields.register ?? '' },
	].filter((item) => item.value),
)
</script>

<template>
	<PageContent
		:title="page.title"
		:blocks="page.blocks"
		:media="page.media"
	>
		<template #after>
			<section
				class="mt-16 px-16 font-sans text-base text-gray-800"
				data-testid="legal-details"
			>
				<p
					v-if="firmName"
					class="m-0 mb-12 font-semibold"
				>
					{{ firmName }}
				</p>
				<p
					v-else
					class="m-0 mb-12 text-gray-400"
				>
					{{ t('legal.missingFirm') }}
				</p>
				<dl class="m-0 grid grid-cols-[max-content_1fr] gap-x-24 gap-y-8 text-sm">
					<template
						v-for="entry in contact"
						:key="entry.id"
					>
						<dt class="font-medium text-gray-500">{{ entry.label }}</dt>
						<dd class="m-0">
							<template v-if="entry.type === 'address'">
								<span
									v-for="line in addressLines(entry.address)"
									:key="line"
									class="block"
									>{{ line }}</span
								>
							</template>
							<a
								v-else-if="entryHref(entry)"
								:href="entryHref(entry)!"
								class="text-primary"
								>{{ entryText(entry) }}</a
							>
							<span v-else>{{ entry.value }}</span>
						</dd>
					</template>
					<template
						v-for="item in legal"
						:key="item.label"
					>
						<dt class="font-medium text-gray-500">{{ item.label }}</dt>
						<dd class="m-0">{{ item.value }}</dd>
					</template>
				</dl>
			</section>
		</template>
	</PageContent>
</template>
