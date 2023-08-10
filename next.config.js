const cp = require('child_process');
const { i18n } = require('./next-i18next.config.js')
const withLess = require("next-with-less");
const OptimizeCSSPlugin = require('css-minimizer-webpack-plugin');

const pkgInfo = require('./package.json');

module.exports = withLess({
    i18n,
    env: {
        APP_VERSION: pkgInfo.version,
        APP_COMMIT: cp.execSync('git rev-parse HEAD').toString().trim(),
        INNER_BASE_URL: process.env.INNER_BASE_URL || 'https://senka.me'
    },
    poweredByHeader: false,
    webpack: (config, { dev }) => {
        if (!dev) {
            config.plugins.push(new OptimizeCSSPlugin());
        }
        return config
    },
});
