const path = require("path");

/** @type {import('next-i18next').UserConfig} */
module.exports = {
    i18n: {
        defaultLocale: 'ja',
        locales: ['ja', 'zh', 'en'],
        localeDetection: false
    },
    fallbackLng: {
        default: ['ja']
    },
    nonExplicitSupportedLngs: true,
    localePath: typeof window === 'undefined' ? path.resolve(__dirname, './public/static/locales') : '/static/locales'
}