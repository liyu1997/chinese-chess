# 静弈 · 中国象棋

静态网页象棋，支持人机对弈、同屏双人、皮肤切换和沉浸模式。当前不含远程联机功能。

## Cloudflare Pages 发布

1. 在 Cloudflare 的 Workers & Pages 中创建 Pages 项目，连接此 GitHub 仓库。
2. 生产分支选择 `main`。
3. 框架预设选择 `None`；构建命令留空；构建输出目录填写 `dist`；根目录保持默认。
4. 保存并部署，使用返回的 `pages.dev` 网址访问。

后续向 GitHub 推送更新后，已连接的 Pages 项目可自动部署。国内网络可访问性请实测。

## 本地运行（可选）

```sh
python3 -m http.server 8080 --bind 127.0.0.1 --directory dist
```

浏览器访问 http://127.0.0.1:8080 。所有游戏图片和字体位于 dist 内。

## 检查

```sh
node tests/rules.cjs
node tests/agreement.cjs
```

源码来自现有「静弈 · 中国象棋」项目。字体许可见 dist/fonts 中的 OFL 文件。本仓库未授予整体开源许可。
