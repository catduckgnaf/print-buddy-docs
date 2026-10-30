import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Print Handy',
  description: 'Prepare and manage 3D prints from Discord, with an explicit confirmation before printing.',
  base: '/print-handy-docs/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/print-handy-docs/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/print-handy-docs/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#f97316' }],
    ['meta', { property: 'og:title', content: 'Print Handy' }],
    ['meta', { property: 'og:description', content: 'Prepare and manage 3D prints from Discord, with an explicit confirmation before printing.' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://catduckgnaf.github.io/print-handy-docs/' }],
  ],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'Print Handy',
    nav: [
      { text: 'Guide', link: '/guide' },
      { text: 'Install', link: '/docker' },
      { text: 'Printers', link: '/printer-profiles' },
      { text: 'Configuration', link: '/configuration-yaml' },
      { text: 'Troubleshooting', link: '/troubleshooting' },
      {
        text: 'External',
        items: [
          { text: 'GitHub repo', link: 'https://github.com/catduckgnaf/print-handy' },
          { text: 'Releases', link: 'https://github.com/catduckgnaf/print-handy/releases' },
          { text: 'Wiki', link: 'https://github.com/catduckgnaf/print-handy/wiki' },
          { text: 'Printer support', link: '/printer-support' },
          { text: 'Anycubic printers (Kobra 2 family on Moonraker-exposed firmware; Marlin models via OctoPrint)', link: '/anycubic' },
          { text: 'Printer calibration', link: '/calibration' },
          { text: 'AD5X best practices', link: '/device-ad5x' },
          { text: 'Best practices on specific devices', link: '/device-best-practices' },
          { text: 'Firmware updates', link: '/firmware-update' },
          { text: 'Running the AI features on Cloudflare\'s free tier', link: '/cloudflare' },
          { text: 'Sovol printers', link: '/sovol' },
        ],
      },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide' },
          { text: 'Project Reference', link: '/project-reference' },
          { text: 'Listener Domains', link: '/listeners' },
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
          { text: 'Web UI', link: '/webui' },
        ],
      },
      {
        text: 'Printers',
        items: [
          { text: 'Printer Profiles', link: '/printer-profiles' },
          { text: 'Flashforge AD5X', link: '/ad5x-contract' },
          { text: 'Best practices on specific devices', link: '/device-best-practices' },
          { text: 'AD5X best practices', link: '/device-ad5x' },
          { text: 'Stock Flashforge', link: '/flashforge-stock' },
          { text: 'Bambu Lab', link: '/bambu-lab' },
          { text: 'Prusa', link: '/prusa' },
          { text: 'Elegoo', link: '/elegoo' },
          { text: 'Creality', link: '/creality' },
          { text: 'Qidi', link: '/qidi' },
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
          { text: 'Diagnostics', link: '/diagnostics' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/catduckgnaf/print-handy' },
    ],
    search: {
      provider: 'local',
    },
    editLink: {
      pattern: 'https://github.com/catduckgnaf/print-handy-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Documentation content is copied from <a href="https://github.com/catduckgnaf/print-handy">catduckgnaf/print-handy</a> — that repo\'s <code>docs/</code> directory is the source of truth.',
      copyright: 'Copyright © 2026 catduck. Released under the MIT License.',
    },
  },
})
