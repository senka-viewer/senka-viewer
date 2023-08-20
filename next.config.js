const cp = require('child_process');
const { i18n } = require('./next-i18next.config.js')
const withLess = require("next-with-less");

const pkgInfo = require('./package.json');

/**
 * @type {import('next').NextConfig}
 **/
const config = {
    i18n,
    env: {
        APP_VERSION: pkgInfo.version,
        APP_COMMIT: cp.execSync('git rev-parse HEAD').toString().trim(),
        INNER_BASE_URL: process.env.INNER_BASE_URL || 'https://senka.me'
    }
};

module.exports = withLess(config);
