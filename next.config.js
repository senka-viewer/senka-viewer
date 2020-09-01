const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const withLess = require('@zeit/next-less');
const lessToJS = require('less-vars-to-js');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

const pkgInfo = require('./package.json');

const themeVariables = lessToJS(
    fs.readFileSync(path.resolve(__dirname, './assets/custom.less'), 'utf8')
);

module.exports = withLess({
    env: {
        INNER_BASE_URL: process.env.INNER_BASE_URL || 'https://senka.su',
        // 版本: version (head commit hash)
        APP_VERSION: `${pkgInfo.version} (${cp.execSync('git rev-parse --short HEAD').toString().trim()})`
    },
    poweredByHeader: false,
    publicRuntimeConfig: {
        localeSubpaths: typeof process.env.LOCALE_SUBPATHS === 'string'
            ? process.env.LOCALE_SUBPATHS
            : 'none',
    },
    lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: themeVariables
    },
    webpack: (config, { isServer, dev }) => {
        if (isServer) {
            const antStyles = /antd\/.*?\/style.*?/;
            const origExternals = [...config.externals];
            config.externals = [
                (context, request, callback) => {
                    if (request.match(antStyles)) return callback();
                    if (typeof origExternals[0] === 'function') {
                        origExternals[0](context, request, callback)
                    } else {
                        callback()
                    }
                },
                ...(typeof origExternals[0] === 'function' ? [] : origExternals),
            ];

            config.module.rules.unshift({
                test: antStyles,
                use: 'null-loader',
            })
        }
        if (!dev) {
            config.plugins.push(new OptimizeCSSPlugin());
        }
        return config
    },
});
