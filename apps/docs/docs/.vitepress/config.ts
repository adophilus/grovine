// console.log(process.env)
import '../../src/env'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Grovine',
  description: 'Documentation for Grovine',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' }
      // { text: "Examples", link: "/markdown-examples" },
    ],

    // sidebar: [
    //   {
    //     text: "Examples",
    //     items: [
    //       { text: "Markdown Examples", link: "/markdown-examples" },
    //       { text: "Runtime API Examples", link: "/api-examples" },
    //     ],
    //   },
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/adophilus/grovine' }
    ]
  }
})
