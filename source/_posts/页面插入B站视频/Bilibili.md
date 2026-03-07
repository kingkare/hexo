---
abbrlink: 插入B站视频
categories: []
date: '2026-03-08T02:45:14.472239+08:00'
excerpt:  在需要的文章页插入即可。   直接复制插入你的md文章就行，修改里面的aid为你的视频id：  &lt;div align=center class=&quot;aspect-ratio&quot;&gt;     &lt;iframe src=&quot;https://player.bilibili.com/player.html?aid=9926758&amp;&amp;page=1&am...
tags:
- 页面
- 插入
- B站
- 视频
- Bilibili
title: 页面插入B站视频/Bilibili
updated: '2026-03-08T02:46:52.975+08:00'
---
> 在需要的文章页插入即可。

> 直接复制插入你的`md`文章就行，修改里面的aid为你的视频id：

```html
<div align=center class="aspect-ratio">
    <iframe src="https://player.bilibili.com/player.html?aid=9926758&&page=1&as_wide=1&high_quality=1&danmaku=0&autoplay=0" 
    scrolling="no" 
    border="0" 
    frameborder="no" 
    framespacing="0" 
    high_quality=1
    danmaku=1 
    allowfullscreen="true"> 
    </iframe>
</div>

```

> 记得去`blog/source/css/custom.css`里，添加上述的样式：

```css
/*哔哩哔哩视频适配*/
.aspect-ratio {position: relative;width: 100%;height: 0;padding-bottom: 75%;margin: 3% auto;text-align: center;}    
.aspect-ratio iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
}

```
