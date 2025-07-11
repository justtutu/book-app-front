# 前端部署与 Nginx 配置操作指南（CentOS）

## 一、前端部署流程

### 1. 推荐方式：使用 GitHub Actions 自动化部署

1. **配置 GitHub Actions 工作流**
   - 在项目的 `.github/workflows/deploy.yml` 文件中添加如下内容（示例）：
     ```yaml
     name: Deploy H5 to Cloud Server

     on:
       push:
         branches:
           - main

     jobs:
       build-and-deploy:
         runs-on: ubuntu-latest
         steps:
           - name: Checkout code
             uses: actions/checkout@v4

           - name: Setup Node.js
             uses: actions/setup-node@v4
             with:
               node-version: 20

           - name: Setup pnpm
             uses: pnpm/action-setup@v2
             with:
               version: 8

           - name: Install dependencies
             run: pnpm install

           - name: Build H5
             run: pnpm build:h5

           - name: Deploy to Cloud Server via SCP
             uses: appleboy/scp-action@v0.1.7
             with:
               host: ${{ secrets.SERVER_HOST }}
               username: ${{ secrets.SERVER_USER }}
               port: ${{ secrets.SERVER_PORT }}
               key: ${{ secrets.SSH_PRIVATE_KEY }}
               source: 'dist/build/h5/*'
               target: ${{ secrets.SERVER_PATH }}
               strip_components: 3
               rm: true
     ```
   - 相关 Secrets 需在 GitHub 仓库设置中配置（如 `SERVER_HOST`、`SERVER_USER`、`SERVER_PORT`、`SSH_PRIVATE_KEY`、`SERVER_PATH`）。

2. **自动上传产物到服务器**
   - 每次 push 到 main 分支，GitHub Actions 会自动构建并上传产物到服务器指定目录（如 `/www/boogo.site/book-app/`）。

3. **检查部署结果**
   - 可在 GitHub Actions 页面查看 workflow 执行日志和状态。
   - 服务器上产物目录应包含 `index.html` 及静态资源。

### 2. 手动部署方式（备选）

1. **本地构建前端项目**
   ```bash
   pnpm build:h5
   # 或 npm run build:h5 / yarn build:h5
   # 产物一般在 dist/build/h5 目录下
   ```

2. **手动上传构建产物到服务器**
   - 推荐上传到 `/www/boogo.site/book-app/` 目录。
   - 可用 WinSCP、Xftp、SCP 命令等工具。

3. **检查上传结果**
   ```bash
   ls -l /www/boogo.site/book-app/
   # 应包含 index.html 及静态资源
   ```

## 二、Nginx 常用操作与配置

### 1. 常用命令
- 检查配置语法：
  ```bash
  nginx -t
  ```
- 重载配置（不重启服务）：
  ```bash
  sudo nginx -s reload
  ```
- 启动 Nginx：
  ```bash
  sudo systemctl start nginx
  ```
- 停止 Nginx：
  ```bash
  sudo systemctl stop nginx
  ```
- 查看状态：
  ```bash
  sudo systemctl status nginx
  ```

### 2. 常用配置片段

```nginx
server {
    listen 443 ssl;
    server_name boogo.site www.boogo.site;

    ssl_certificate      /etc/nginx/ssl/bookgo.site_ssl.crt;
    ssl_certificate_key  /etc/nginx/ssl/bookgo.site_ssl.key;
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout  10m;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 兼容 /book-app 和 /book-app/ 访问
    location = /book-app {
        return 301 /book-app/;
    }
    location /book-app/ {
        alias /www/boogo.site/book-app/;
        index index.html;
        try_files $uri $uri/ /book-app/index.html;
    }

    # 其它请求（如 /api 或 /）继续走后端
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name boogo.site www.boogo.site;
    return 301 https://$host$request_uri;
}
```

### 3. 证书文件注意事项
- 证书和私钥路径需与配置一致。
- 权限建议 644，属主 root。
- 如遇“找不到证书文件”，请用命令行 `ls -l` 检查实际存在。

## 三、vi 编辑器常用命令

- 进入插入模式：
  - `i`：在光标前插入
  - `a`：在光标后插入
  - `o`：在当前行下新开一行
- 退出插入模式：
  - `Esc`
- 保存文件：
  - `:w`
- 退出 vi：
  - `:q`
- 保存并退出：
  - `:wq` 或 `ZZ`
- 强制退出（不保存）：
  - `:q!`
- 删除当前行：
  - `dd`
- 撤销上一步：
  - `u`
- 查找内容：
  - `/关键字` 回车，`n` 下一个
- 跳转到行号：
  - `:数字`（如 `:10` 跳到第10行）

---

> 本文档适用于 CentOS 服务器环境，适合新手快速部署前端项目并配置 Nginx。如有特殊需求请根据实际情况调整。 