const next = require('next');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const { nextI18NextMiddleware } = require('next-i18next/dist/commonjs/middlewares');

const nextI18next = require('./i18n');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

const devProxy = {
    '/server': {
        target: 'https://senka.su/',
        changeOrigin: true
    }
};

(async () => {
    await app.prepare();
    const server = express();

    server.disable('x-powered-by');

    await nextI18next.initPromise;
    server.use(nextI18NextMiddleware(nextI18next));

    if (dev && devProxy) {
        Object.keys(devProxy)
            .forEach(context =>
                server.use(createProxyMiddleware(context, devProxy[context]))
            )
    }

    server.get('*', (req, res) => handle(req, res));

    await server.listen(port);
    console.log(`> Ready on http://localhost:${port}`);
})();
