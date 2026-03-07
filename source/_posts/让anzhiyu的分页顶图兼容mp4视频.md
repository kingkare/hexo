---
abbrlink: anzhiyu的分页顶图兼容mp4视频
categories:
- - 教程
date: '2026-03-08T01:03:22.693349+08:00'
tags:
- anzhiyu
- 安知鱼
- 顶图
- 教程
- hexo
- 视频
title: 让anzhiyu的分页顶图兼容mp4视频
updated: '2026-03-08T01:03:23.252+08:00'
---
# 正篇

> 首先找到“主题目录\anzhiyu\layout\includes\page\essay.pug”

## 修改如下

```
-      .author-content.author-content-item.essayPage.single(style = i.top_background ? `background: url(${i.top_background}) left 28% / cover no-repeat;` : "")
+      .author-content.author-content-item.essayPage.single(style = i.top_background && !i.top_background.endsWith('.mp4') ? `background: url(${i.top_background}) left 28% / cover no-repeat;` : "")
+        if i.top_background && i.top_background.endsWith('.mp4')
+          video(autoplay loop muted playsinline style="pointer-events: none; object-fit: cover; top: 50%; left: 50%; transform: translate(-50%, -50%); min-width: 100%; min-height: 100% ; width: auto; height: auto ;position: absolute;")
+            source(src=url_for(i.top_background) type="video/mp4")
````

> 修改完毕，在essay.yml的顶部配置项的top\_background，现在也可以调用mp4视频了


以上拿的即可短文页面举例 其他举一反三！

```yml
 - title: 即刻短文
-  top_background: https://我原来是图片.png
+  top_background: https://现在这里可以是视频了.mp4
```
