<script setup lang="ts">
// Override: the CMS footer (logo, firm, contact, footer pages) + this site's social media links below it.
import { computed } from 'vue'
import Base from '@trainpaths/cms/src/components/SiteFooter.vue'
import { filledEntries, type SiteConfig } from '@trainpaths/cms/site'

const props = defineProps<{ config: SiteConfig | null }>()
const socials = computed(() => filledEntries(props.config, 'socials'))
</script>

<template>
	<div class="mt-auto">
		<Base :config="config" />
		<nav
			v-if="socials.length"
			class="border-t border-gray-200 bg-gray-50 font-sans"
			aria-label="Social media"
			data-testid="site-socials"
		>
			<ul class="m-0 mx-auto flex max-w-5xl list-none flex-wrap gap-16 px-24 py-12 text-sm">
				<li
					v-for="social in socials"
					:key="social.id"
				>
					<a
						:href="social.value"
						class="text-primary no-underline hover:underline"
						target="_blank"
						rel="noopener noreferrer"
						>{{ social.label }}</a
					>
				</li>
			</ul>
		</nav>
	</div>
</template>
