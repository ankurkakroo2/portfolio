const withNextra = require('nextra')({
  // Tell Nextra to use the custom theme as the layout
  themeConfig: './theme.config.jsx',
})

module.exports = withNextra({
  // Other Next.js configurations
  i18n: {
    locales: ['default', 'en', 'de'],
    defaultLocale: 'default',
  },
})
