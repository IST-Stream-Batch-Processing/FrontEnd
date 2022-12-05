const { createProxyMiddleware } = require('http-proxy-middleware');

const url = 'http://202.120.40.86:30090';

module.exports = (app) => {
    app.use(
        createProxyMiddleware('/userApi', {
            // target: 'http://localhost:8082', // 可修改
            target: url.concat('/userApi'),
            changeOrigin: true,
            pathRewrite: {
                '^/userApi': '',
            },
        }),
    );
    app.use(
        createProxyMiddleware('/projectApi', {
            // target: 'http://localhost:8080', // 可修改
            target: url.concat('/projectApi'),
            changeOrigin: true,
            pathRewrite: {
                '^/projectApi': '',
            },
        }),
    );
    app.use(
        createProxyMiddleware('/dataApi', {
            // target: 'http://localhost:8081', // 可修改
            target: url.concat('/dataApi'),
            changeOrigin: true,
            pathRewrite: {
                '^/dataApi': '',
            },
        }),
    );
    app.use(
        createProxyMiddleware('/asApi', {
            // target: 'http://localhost:8083', // 可修改
            target: url.concat('/asApi'),
            changeOrigin: true,
            pathRewrite: {
                '^/asApi': '',
            },
        }),
    );
    app.use(
        createProxyMiddleware('/guiApi', {
            // target: 'http://localhost:9999', // 可修改
            target: url.concat('/guiApi'),
            changeOrigin: true,
            pathRewrite: {
                '^/guiApi': '',
            },
        }),
    );
    app.use(
        createProxyMiddleware('/osApi', {
            // target: 'http://localhost:9000', // 可修改
            target: url.concat('/osApi'),
            changeOrigin: true,
            pathRewrite: {
                '^/osApi': '',
            },
        }),
    );
  app.use(
    createProxyMiddleware('/intelligenceApi', {
      // target: 'http://localhost:8090', // 可修改
      target: url.concat('/intelligenceApi'),
      changeOrigin: true,
      pathRewrite: {
        '^/intelligenceApi': '',
      },
    }),
  );
  app.use(
    createProxyMiddleware('/fileApi', {
      // target: 'http://localhost:8000', // 可修改
      target: url.concat('/fileApi'),
      changeOrigin: true,
      pathRewrite: {
        '^/fileApi': '',
      },
    }),
  );
    app.use(
        createProxyMiddleware('/streamApi', {
            target: 'http://localhost:8081', // 可修改
            // target: url.concat('/fileApi'),
            changeOrigin: true,
            pathRewrite: {
                '^/streamApi': '',
            },
        }),
    );
};
