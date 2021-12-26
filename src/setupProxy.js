const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        createProxyMiddleware ('/api', {
            target: 'http://localhost:8001/',
            changeOrigin: true
        }),
        createProxyMiddleware ('/auth', {
            target: 'http://localhost:8001/',
            changeOrigin: true
        }),
        createProxyMiddleware ('/database', {
            target: 'http://localhost:8001/',
            changeOrigin: true
        })
    );
}