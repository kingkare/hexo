---
abbrlink: 首页背景图渐进式加载
categories:
- - 教程
date: '2026-03-07T01:53:15.638989+08:00'
tags:
- Hexo
- 魔改
- 教程
- anzhiyu
- 安知鱼
- 渐变
- 一图流
- 加载
title: Kouseki式首页背景图渐进式加载 · 改
updated: '2026-03-07T01:53:15.916+08:00'
---
[原教程](https://satera.cn/posts/6a8fb549/)

# 前言(小旦(原作者))

内容从简，修BUG的事，我就只在原文说明上少量修改，并把代码换了
9月26日：发现刷新网页不加载的问题
来自懒加载对应项未修改
9月27日：发现再次进入首页时，ProgressiveLoad类重复声明
避免重复定义，在定义ProgressiveLoad类前加判断(9月30日改动后废弃)
9月28日：发现跨页返回首页时，会重复创建ProgressiveLoad类并调用
新增每次加载前先清除已有的.pl-container元素
一图流有人想抄
9月29日：首页图下方的有个奇怪的边界的情况，其中一个原因是模糊的小图藏在后面
新增监听动画移除小图元素
另一个原因是夜间阅读模式，给出解决方案
9月30日：Safari浏览器缓存机制导致之前ProgressiveLoad类前加判断时无法显示首页图
使用立即执行函数表达式，给ProgressiveLoad创建一个单独作用域

# 样式预览

![bDUyEzq.png](https://i.meee.com.tw/bDUyEzq.png)

> 原理是先加载小图文件并进行高斯模糊处理，在大图加载完成后再对大图进行加载。

# 操作步骤

## 效果二选一

> 选择仅渐变式加载或渐变式一图流其中一种效果
> 仅渐变式加载是Kouseki的教程版
> 渐变式一图流是Kouseki的首页版

### 1、新建文件

> 新建文件source/js/imgloaded.js新增以下内容，并按照注释调整图片路径

#### 仅渐变式加载


```js
/**
 * @description 实现medium的渐进加载背景的效果
 */
(function() {
  // 定义ProgressiveLoad类
  class ProgressiveLoad {
    constructor(smallSrc, largeSrc) {
      this.smallSrc = smallSrc;
      this.largeSrc = largeSrc;
      this.initTpl();
      //监听动画事件结束
      this.container.addEventListener('animationend', () => {
        //隐藏小图
        this.smallStage.style.display = 'none'; 
      }, {once: true});
    }

    /**
     * @description 生成ui模板
     */
    initTpl() {
      this.container = document.createElement('div');
      this.smallStage = document.createElement('div');
      this.largeStage = document.createElement('div');
      this.smallImg = new Image();
      this.largeImg = new Image();
      this.container.className = 'pl-container';
      this.smallStage.className = 'pl-img pl-blur';
      this.largeStage.className = 'pl-img';
      this.container.appendChild(this.smallStage);
      this.container.appendChild(this.largeStage);
      this.smallImg.onload = this._onSmallLoaded.bind(this);
      this.largeImg.onload = this._onLargeLoaded.bind(this);
    }

    /**
     * @description 加载背景
     */
    progressiveLoad() {
      this.smallImg.src = this.smallSrc;
      this.largeImg.src = this.largeSrc;
    }

    /**
     * @description 大图加载完成
     */
    _onLargeLoaded() {
      this.largeStage.classList.add('pl-visible');
      this.largeStage.style.backgroundImage = `url('${this.largeSrc}')`;
    }

    /**
     * @description 小图加载完成
     */
    _onSmallLoaded() {
      this.smallStage.classList.add('pl-visible');
      this.smallStage.style.backgroundImage = `url('${this.smallSrc}')`;
    }
  }

  const executeLoad = (config, target) => {
    console.log('执行渐进背景替换');
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const loader = new ProgressiveLoad(
      isMobile ? config.mobileSmallSrc : config.smallSrc,
      isMobile ? config.mobileLargeSrc : config.largeSrc
    );
    // 和背景图颜色保持一致，防止高斯模糊后差异较大
    if (target.children[0]) {
      target.insertBefore(loader.container, target.children[0]);
    }
    loader.progressiveLoad();
  };

  const config = {
    smallSrc: '/img/xiaotu.jpg', // 小图链接 尽可能配置小于100k的图片
    largeSrc: '/img/tu.jpg', // 大图链接 最终显示的图片
    mobileSmallSrc: '/img/sjxt.jpg', // 手机端小图链接 尽可能配置小于100k的图片
    mobileLargeSrc: '/img/sjdt.jpg', // 手机端大图链接 最终显示的图片
    enableRoutes: ['/'],
    };

  function initProgressiveLoad(config) {
    // 每次加载前先清除已有的元素
    const container = document.querySelector('.pl-container');
    if (container) {
      container.remove();
    }
    const target = document.getElementById('page-header');
    if (target && target.classList.contains('full_page')) {
      executeLoad(config, target);
    }
  }

  function onPJAXComplete(config) {
    const target = document.getElementById('page-header');
    if (target && target.classList.contains('full_page')) {
      initProgressiveLoad(config);
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    initProgressiveLoad(config);
  });

  document.addEventListener("pjax:complete", function() {
    onPJAXComplete(config);
  });

})();
```

#### 渐变式一图流


```js
// 首页头图加载优化
/**
 * @description 实现medium的渐进加载背景的效果
 */
  // 定义ProgressiveLoad类
class ProgressiveLoad {
  constructor(smallSrc, largeSrc) {
    this.smallSrc = smallSrc;
    this.largeSrc = largeSrc;
    this.initScrollListener(),
    this.initTpl();
  }
  // 这里的1是滚动全程渐变 改为0.3就是前30%渐变后固定前30%产生的渐变效果
  initScrollListener() {
    window.addEventListener("scroll", (()=>{
      var e = Math.min(window.scrollY / window.innerHeight, 1);
      this.container.style.setProperty("--process", e)
    }
    ))
  }
  /**
   * @description 生成ui模板
   */
  initTpl() {
    this.container = document.createElement('div');
    this.smallStage = document.createElement('div');
    this.largeStage = document.createElement('div');
    this.video = document.createElement('div');
    this.smallImg = new Image();
    this.largeImg = new Image();
    this.container.className = 'pl-container';
    this.container.style.setProperty("--process", 0),
    this.smallStage.className = 'pl-img pl-blur';
    this.largeStage.className = 'pl-img';
    this.video.className = 'pl-video';
    this.container.appendChild(this.smallStage);
    this.container.appendChild(this.largeStage);
    this.container.appendChild(this.video);
    this.smallImg.onload = this._onSmallLoaded.bind(this);
    this.largeImg.onload = this._onLargeLoaded.bind(this);
  }

  /**
   * @description 加载背景
   */
  progressiveLoad() {
    this.smallImg.src = this.smallSrc;
    this.largeImg.src = this.largeSrc;
  }
  /**
   * @description 大图加载完成
   */
  _onLargeLoaded() {
    this.largeStage.classList.add('pl-visible');
    this.largeStage.style.backgroundImage = `url('${this.largeSrc}')`;
  }
   /**
   * @description 小图加载完成
   */
  _onSmallLoaded() {
    this.smallStage.classList.add('pl-visible');
    this.smallStage.style.backgroundImage = `url('${this.smallSrc}')`;
  }
}

const executeLoad = (config, target) => {
  console.log('执行渐进背景替换');
  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const loader = new ProgressiveLoad(
    isMobile ? config.mobileSmallSrc : config.smallSrc,
    isMobile ? config.mobileLargeSrc : config.largeSrc
  );
  // 和背景图颜色保持一致，防止高斯模糊后差异较大
  if (target.children[0]) {
    target.insertBefore(loader.container, target.children[0]);
  }
  loader.progressiveLoad();
};

const config = {
  smallSrc: '/img/xiaotu.jpg', // 小图链接 尽可能配置小于100k的图片
  largeSrc: '/img/tu.jpg', // 大图链接 最终显示的图片
  mobileSmallSrc: '/img/sjxt.jpg', // 手机端小图链接 尽可能配置小于100k的图片
  mobileLargeSrc: '/img/sjdt.jpg', // 手机端大图链接 最终显示的图片
  enableRoutes: ['/'],
  };

function initProgressiveLoad(config) {
  // 每次加载前先清除已有的元素
  const container = document.querySelector('.pl-container'); 
  if (container) {
    container.remove(); 
  }
  const target = document.getElementById('page-header');
  if (target && target.classList.contains('full_page')) {
    executeLoad(config, target);
  }
}

function onPJAXComplete(config) {
  const target = document.getElementById('page-header');
  if (target && target.classList.contains('full_page')) {
    initProgressiveLoad(config);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  initProgressiveLoad(config);
});

document.addEventListener("pjax:complete", function() {
  onPJAXComplete(config);
});
```

### 新建css文件

> source/css/imgloaded.css 新增以下内容，并按照注释自行决定调整内容

#### 仅渐变式加载


```css
/* 首页头图加载 */  
.pl-container {  
  width: 100%;  
  height: 100%;  
  position: relative;  /* 一图流这里改fixed */  
  /* 一图流这里加z-index: -2; */ 
  overflow: hidden;  
  will-change: transform; /* 添加性能优化 */  
  /* blur-to-clear模糊动画2s */
  animation: blur-to-clear 2s cubic-bezier(.62,.21,.25,1) 0s 1 normal backwards running, scale 1.5s cubic-bezier(.62,.21,.25,1) 0s 1 both;  
}  
.pl-img {  
  width: 100%;  
  height: 100%;  
  position: absolute;  
  background-position: center;  
  background-size: cover;  
  background-repeat: no-repeat;  
  opacity: 0;  
  transition: opacity 1s;  
}  
  
@keyframes blur-to-clear {  
  0% {  
    filter: blur(50px);  
    opacity: 1;  
  }  
  100% {  
    filter: blur(0);  
    opacity: 1;  
  }  
}  
  
@keyframes scale {  
  0% {  
    transform: scale(1.5) translateZ(0);  
    opacity: 0;  
  }  
  to {  
    transform: scale(1) translateZ(0);  
    opacity: 1;  
  }  
}  
  
.pl-visible {  
  opacity: 1;  
}  
  
.pl-blur {  
  /* 小图锯齿多，增加高斯模糊 */  
  filter: blur(50px);  
}
```

#### 渐变式一图流


```css
/* 首页头图加载 */
body[data-type=anzhiyu] #nav,body[data-type=anzhiyu] #scroll-down,body[data-type=anzhiyu] #site-info {
  -webkit-animation: scale 2.2s cubic-bezier(.6,.1,.25,1) .5s 1 backwards;
  animation: scale 2.2s cubic-bezier(.6,.1,.25,1) .5s 1 backwards
}

@media screen and (max-width: 768px) {
  .pl-container {
      position:relative!important
  }
}

@media screen and (min-width: 768px) {
  #page-header.full_page,.pl-container {
    height:100vh
  }

  #page-header.full_page.expand-to-full,.pl-container.expand-to-full {
    height: 50vh!important
  }
  .pl-container {
      will-change: opacity,transform,filter;
      opacity: calc(1 - var(--process) * 1)!important;
      transform: scale(calc(1 + var(--process) * .1));
      filter: blur(calc(var(--process) * 10px));
  }
}

.pl-container {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: -2;
    overflow: hidden;
    will-change: transform; /* 添加性能优化 */
    animation: blur-to-clear 2.5s cubic-bezier(.6,.25,.25,1) 0s 1 backwards,scale 2.2s cubic-bezier(.6,.1,.25,1) .5s 1 backwards;
  }

  .pl-img {
    width: 100%;
    height: 100%;
    position: absolute;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    opacity: .1;
    transition: opacity 1s;
    will-change: transform,opacity
  }
  .pl-video.pl-visible {
    display: block
}
  @keyframes blur-to-clear {
    0% {
      filter: blur(50px);
      opacity: 1;
    }
    100% {
      filter: blur(0);
      opacity: 1;
    }
  }
  
  @keyframes scale {
    0% {
      transform: scale(1.5) translateZ(0);
      opacity: 0;
    }
    to {
      transform: scale(1) translateZ(0);
      opacity: 1;
    }
  }
  .pl-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAKUlEQVQImU3IMREAIAgAwJfNkQCEsH8cijjpMf6vnXlQaIiJFx+omEBfmqIEZLe2jzcAAAAASUVORK5CYII=);
 }

  .pl-visible {
    opacity: 1;
  }
  
  .pl-blur {
    /* 小图锯齿多，增加高斯模糊 */
    filter: blur(50px);
  }
```

### 2、引入文件

> 在_config.anzhiyu.yml主题配置文件下inject配置项中head和bottom处
> 分别引入imgloaded.css和imgloaded.js文件


```yml

inject:  
  head:  
    - <link rel="stylesheet" href="/css/imgloaded.css?1">  
  
  bottom:  
    - <script async data-pjax src="/js/imgloaded.js?1"></script> # 首页图片渐进式加载
```

### 3、配置图片

> 务必记得在主题配置文件中开启顶部图的功能，就像这样配置空链接。


```yml
# The banner image of home page  
index_img: "background: url() top / cover no-repeat"
```

> 在imgloaded.js中的73到76行（或是83到86行）修改以下示例的部分
> 配置自己的图片，可以是图片直链也可以是本地路径


```js
const config = {  
  smallSrc: '/img/xiaotu.jpg', // 小图链接 尽可能配置小于100k的图片  
  largeSrc: '/img/tu.jpg', // 大图链接 最终显示的图片  
  mobileSmallSrc: '/img/sjxt.jpg', // 手机端小图链接 尽可能配置小于100k的图片  
  mobileLargeSrc: '/img/sjdt.jpg', // 手机端大图链接 最终显示的图片  
  enableRoutes: ['/'],  
  };
```

### 4、图片懒加载配置修改


> 在主题配置文件中找到`# Lazyload`，将`field`项改为`post`，`blur`维持`true`


```yml

lazyload:
  enable: true
  field: post # site/post
  placeholder:
  blur: true
  progressive: true
```

### 5、大功告成


> 到这一步若你配置的图片文件没有问题，可以执行hexo三连查看效果啦！



### 6、常见问题

1. 首页图下方的有个奇怪的边界的情况(还有一图流的时候，自行设计渐变)
2. 如果大图的下边界有不透明度变化，模糊小图，小图会超出不透明度范围，露出小图
3. 如果开了夜间模式，是因为由夜间模式的阅读模式叠加一层0.3的alpha，具体是blog\themes\anzhiyu\source\css_mode\darkmode.styl文件里的background-color: alpha($dark-black, 0.3)，改为


```styl
background-image: linear-gradient(
  to bottom,
  rgba($dark-black, 0.1) 0%, 
  rgba($dark-black, 0) 75%,
  rgba($dark-black, 0) 100%  
);
```

原教程链接：

[原教程](https://blog.kouseki.cn/posts/4f72.html)
