const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy requests to the console api.
  app.use(
    '/console/api/v0',
    createProxyMiddleware({
      target: 'http://localhost:6312',
      changeOrigin: false,
      pathRewrite: {
        '^/console/api/v0': '/', // Remove base path.
      },
      logLevel: 'debug',
    })
  );

  // Proxy requests to the login api.
  app.use(
    '/login/api/v0',
    createProxyMiddleware({
      target: 'http://localhost:6311',
      changeOrigin: false,
      pathRewrite: {
        '^/login/api/': '/', // Remove base path.
      },
      logLevel: 'debug',
    })
  );

  // Proxy requests to the landing page.
  app.use(
    [
      '/data/',
      '/styles/branding.css',
    ],
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: false,
      logLevel: 'debug',
    })
  );
};

