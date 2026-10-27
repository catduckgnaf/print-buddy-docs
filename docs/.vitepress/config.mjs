import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Print Buddy',
  description: 'Prepare and manage 3D prints from Discord, with an explicit confirmation before printing.',
  base: '/print-buddy-docs/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/print-buddy-docs/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/print-buddy-docs/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#f97316' }],
    ['meta', { property: 'og:title', content: 'Print Buddy' }],
    ['meta', { property: 'og:description', content: 'Prepare and manage 3D prints from Discord, with an explicit confirmation before printing.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://catduckgnaf.github.io/print-buddy-docs/' }],
  ],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Print Buddy',
    nav: [
      { text: 'Guide', link: '/guide' },
      { text: 'Install', link: '/docker' },
      { text: 'Printers', link: '/printer-profiles' },
      { text: 'Configuration', link: '/configuration-yaml' },
      { text: 'Troubleshooting', link: '/troubleshooting' },
      {
        text: 'External',
        items: [
          { text: 'GitHub repo', link: 'https://github.com/catduckgnaf/print-buddy' },
          { text: 'Releases', link: 'https://github.com/catduckgnaf/print-buddy/releases' },
          { text: 'Wiki', link: 'https://github.com/catduckgnaf/print-buddy/wiki' },
        ],
      },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide' },
          { text: 'Project Reference', link: '/project-reference' },
        ],
      },
      {
        text: 'Install',
        items: [
          { text: 'Standalone Bot', link: '/standalone' },
          { text: 'Docker', link: '/docker' },
          { text: 'Hermes Installation', link: '/install' },
          { text: 'More Than One Printer', link: '/multi-instance' },
          { text: 'Bambu A1 with Docker', link: '/bambu-a1-docker' },
        ],
      },
      {
        text: 'Bots',
        items: [
          { text: 'Discord Bot Setup', link: '/discord-bot-setup' },
          { text: 'Telegram Bot Setup', link: '/telegram-bot-setup' },
          { text: 'Matrix Bot Setup', link: '/matrix-bot-setup' },
          { text: 'Guided Setup & Debugging', link: '/guided-setup-debugging' },
        ],
      },
      {
        text: 'Configuration',
        items: [
          { text: 'YAML Configuration', link: '/configuration-yaml' },
          { text: 'Settings Reference', link: '/settings' },
        ],
      },
      {
        text: 'Printers',
        items: [
          { text: 'Printer Profiles', link: '/printer-profiles' },
          { text: 'Flashforge AD5X', link: '/ad5x-contract' },
          { text: 'Bambu Lab', link: '/bambu-lab' },
          { text: 'Prusa', link: '/prusa' },
          { text: 'Elegoo', link: '/elegoo' },
          { text: 'OctoPrint / Marlin', link: '/octoprint-marlin' },
          { text: 'Flash Studio', link: '/flash-studio' },
          { text: 'ZMod', link: '/zmod' },
        ],
      },
      {
        text: 'Working With Models',
        items: [
          { text: 'Intake Limits', link: '/intake-limits' },
          { text: 'Geometry Layout', link: '/geometry-layout' },
          { text: 'CAD Split Plans', link: '/cad-split-plans' },
          { text: 'AI Design', link: '/design' },
          { text: 'Mesh Audit', link: '/mesh-audit' },
          { text: 'Printer Macros', link: '/macros' },
        ],
      },
      {
        text: 'Troubleshooting',
        items: [
          { text: 'Troubleshooting', link: '/troubleshooting' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/catduckgnaf/print-buddy' },
    ],
    search: {
      provider: 'local',
    },
    editLink: {
      pattern: 'https://github.com/catduckgnaf/print-buddy-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Documentation content is copied from <a href="https://github.com/catduckgnaf/print-buddy">catduckgnaf/print-buddy</a> — that repo\'s <code>docs/</code> directory is the source of truth.',
      copyright: 'Copyright © 2026 catduck. Released under the MIT License.',
    },
  },
})
