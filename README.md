# Senka Viewer

Senka Viewer 网站前端站点

## 部署

### PM2 部署

1.添加/修改配置

映射到后端内网地址

next.config.js

```javascript
// ...
module.exports = withLess({
    env: {
        // FIXME: 改成内部/内网地址
        INNER_BASE_URL: 'http://127.0.0.1:8080',
        // ...
    },
// ...
});
// ...
```

nginx 配置

```shell script
location ^- /server/ {
    proxy_pass http://127.0.0.1:8080;
}
```

2.启动

如果没有安装pm2，先安装pm2

```shell script
npm install -g pm2
```

启动应用

```shell script
npm run start:prod
```

### docker 部署

1.构建镜像

```shell script
docker build -t senka-viewer .
```

2.启动

```shell script
docker run -p 3000:3000 -t senka-viewer
```
