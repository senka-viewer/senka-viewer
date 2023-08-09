const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { i18n } = require('./next-i18next.config.js')
const withLess = require("next-with-less");
const lessToJS = require('less-vars-to-js');
const OptimizeCSSPlugin = require('css-minimizer-webpack-plugin');

const pkgInfo = require('./package.json');

const themeVariables = lessToJS(
    fs.readFileSync(path.resolve(__dirname, './assets/custom.less'), 'utf8')
);

module.exports = withLess({
    i18n,
    env: {
        APP_VERSION: pkgInfo.version,
        APP_COMMIT: cp.execSync('git rev-parse HEAD').toString().trim(),
        INNER_BASE_URL: process.env.INNER_BASE_URL || 'https://senka.me'
    },
    poweredByHeader: false,
    publicRuntimeConfig: {
        localeSubpaths: typeof process.env.LOCALE_SUBPATHS === 'string'
            ? process.env.LOCALE_SUBPATHS
            : 'none',
    },
    lessLoaderOptions: {
        lessOptions: {
            javascriptEnabled: true,
            modifyVars: themeVariables
        }
    },
    webpack: (config, { isServer, dev }) => {
        if (!dev) {
            config.plugins.push(new OptimizeCSSPlugin());
        }
        return config
    },
});
