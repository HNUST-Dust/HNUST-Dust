# HNUST DUST Robotics Website

湖南科技大学 DUST 机器人战队官网，面向 GitHub Pages 构建的零依赖静态站点。

## 本地预览

```bash
python3 -m http.server 8000
```

浏览器打开 `http://localhost:8000`。

## 发布

将仓库推送到 GitHub 后，在 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。工作流会在每次推送到 `main` 时自动部署。

“最新开源”板块会通过 GitHub 公共 API 自动读取 `HNUST-Dust` 最近更新的原创仓库；API 暂时不可用时会展示内置快照。
