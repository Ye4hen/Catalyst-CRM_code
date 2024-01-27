export default defineNuxtConfig({
	app: {
		baseURL: '/Catalyst-CRM/', // baseURL: '/<repository>/'
		buildAssetsDir: 'assets', // don't use "_" at the begining of the folder name to avoids nojkill conflict
	},
	devtools: { enabled: false },
	modules: [
		'@nuxt/ui',
		'@nuxt/image',
		'shadcn-nuxt',
		[
			'@nuxtjs/google-fonts',
			{
				families: {
					Lato: {
						wght: [300, 400, 700],
						ital: [300],
					},
				},
			},
		],
		'nuxt-icon',
		'@pinia/nuxt',
		[
			'@vee-validate/nuxt',
			{
				autoImports: true,
			},
		],
	],
	shadcn: {
		prefix: 'Ui',
		componentDir: './components/ui',
	},
	pinia: {
		storesDirs: ['./store/**'],
	},
})
