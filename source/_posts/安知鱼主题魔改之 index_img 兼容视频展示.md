---
abbrlink: 魔改之 index_img 兼容视频
categories:
- - 教程
date: '2026-03-07T01:02:00.562731+08:00'
tags:
- hexo
- 魔改
- 教程
- 美化
- 安知鱼
- anzhiyu
- 视频
title: 安知鱼主题魔改之 index_img 兼容视频展示
updated: '2026-03-07T01:02:01.014+08:00'
---
[原教程](https://ayakasuki.com/posts/3a7bad23/)

更直观的预览效果可前往博客主页预览

实现效果以及原理

修改 index_img 相关 pug 自定义 top /cover no-repeat 默认为 top 。这部分如需不同效果可自行修改 /static/index_media.css 的 home-media-container 或 home-media 元素

修改主题配置文件下的 index_img 增加 path 和 vpath，横屏壁纸路径为 path，竖屏壁纸路径为 vpath, 该功能实现横竖屏设备不同时加载不同横竖屏自定义壁纸，如无需区分可 path 与 vpath 这路径填同一个即可

增加主题配置文件下 index_video, 其中 path 与 vpath 与 index_img 的填写方法类似，但增加多 poster 与 vposter 选项，这两个选项为视频未加载出来时的加载 GIF 动画，可自定义为 GIF 加载条或者趣味表情包加载，效果如下

![654dabde5468d.gif](https://testingcf.jsdelivr.net/gh/kingkare/owo/img/loading.gif)

path 与 vpath 填对时，横屏与竖屏效果分别如下

![cFGoECJ.png](https://i.meee.com.tw/cFGoECJ.png)

![zxl8AP1.png](https://i.meee.com.tw/zxl8AP1.png)


鼠标出现时壁纸或视频壁纸放大到 105% 并跟随鼠标动态放大的效果
首次加载主页动态壁纸或壁纸成功时壁纸从 105% 线性缩减为预览 100% 实现桌面返回时类似回弹效果
index_img 与 index_video 的 enable 不可同时为 true 否则会报错。但可同时为 false 表示关闭主页 top 图和动态壁纸。
手机或竖屏状态下动态壁纸支持陀螺仪实现视差效果，但 ios 因系统权限获取暂不支持。

# 修改步骤

> 本次修改替换 2 个文件，添加 2 个文件，请注意备份

## 第一步：替换文件

### 直接覆盖 themes/anzhiyu/layout/includes/header/index.pug

`

```
// 优先级控制逻辑（独立作用域）
if !theme.disable_top_img && page.top_img !== false
  if is_post()
    - var top_img = page.top_img || page.cover || page.randomcover
  else if is_page()
    - var top_img = page.top_img || theme.default_top_img
  else if is_home()
    // 首页专用媒体声明（网页5）
    - var home_index_img = theme.index_img?.enable ? theme.index_img.path : false
    - var home_index_video = theme.index_video?.enable ? theme.index_video.path : false
    - var top_img = home_index_img || home_index_video || theme.default_top_img
  else
    - var top_img = page.top_img || theme.default_top_img

  if top_img !== false
    // 路径处理（保留原有逻辑）
    - var imgSource = top_img && top_img.indexOf('/') !== -1 ? url_for(top_img) : top_img
    // 首页专用路径（网页3）
    - var homeImg = home_index_img ? url_for(home_index_img) : ''
    - var homeVideo = home_index_video ? url_for(home_index_video) : ''
    - var bg_img = is_home() ? (home_index_img || home_index_video) : imgSource

    - var site_title = page.title || page.tag || page.category || config.title
    - var isHomeClass = is_home() ? 'full_page' : 'not-home-page'
    - is_post() ? isHomeClass = 'post-bg' : isHomeClass
  else
    - var isHomeClass = 'not-top-img'
else
  - var top_img = false
  - var isHomeClass = 'not-top-img'

header#page-header(class=`${isHomeClass}`)
  !=partial('includes/header/nav', {}, {cache: true})
  if top_img !== false
    if is_post()
      if page.bilibili_bg
        !=partial('includes/bili-banner/index')
      else
        include ./post-info.pug
        if theme.dynamicEffect && theme.dynamicEffect.postTopWave
          section.main-hero-waves-area.waves-area
            svg.waves-svg(xmlns='http://www.w3.org/2000/svg', xlink='http://www.w3.org/1999/xlink', viewBox='0 24 150 28', preserveAspectRatio='none', shape-rendering='auto')
              defs
                path#gentle-wave(d='M -160 44 c 30 0 58 -18 88 -18 s 58 18 88 18 s 58 -18 88 -18 s 58 18 88 18 v 44 h -352 Z')
              g.parallax
                use(href='#gentle-wave', x='48', y='0')
                use(href='#gentle-wave', x='48', y='3')
                use(href='#gentle-wave', x='48', y='5')
                use(href='#gentle-wave', x='48', y='7')
        #post-top-cover
          img#post-top-bg(class='nolazyload' src=bg_img)
    else if is_home()
        // 媒体容器（继承原主题背景参数）
        #home-media-container(
            data-landscape-img=home_index_img ? homeImg : ''
            data-portrait-img=home_index_img && theme.index_img.vpath ? url_for(theme.index_img.vpath) : ''
            data-landscape-video=home_index_video ? homeVideo : ''
            data-portrait-video=home_index_video && theme.index_video.vpath ? url_for(theme.index_video.vpath) : ''
            data-landscape-poster=home_index_video && theme.index_video.poster ? url_for(theme.index_video.poster) : ''
            data-portrait-poster=home_index_video && theme.index_video.vposter ? url_for(theme.index_video.vposter) : ''
            style="height:100%;background-attachment:fixed;z-index:0"
          )
        #site-info
          h1#site-title=site_title
          if theme.subtitle.enable
            - var loadSubJs = true
            #site-subtitle
              span#subtitle
          if(theme.social)
            #site_social_icons
              !=fragment_cache('social', function(){return partial('includes/header/social')})
        #scroll-down
          i.anzhiyufont.anzhiyu-icon-angle-down.scroll-down-effects
    else
      #page-site-info(style=`background-image: url(${imgSource})`)
        h1#site-title=site_title


````


### 直接替换 Styl 文件

> 路径 /themes/anzhiyu/source/css/_layout/oneGraphFlow.styl。，修复小屏 nav 不透明问题。

``

if hexo-config('index_img.enable') || hexo-config('index_video.enable')
#nav
+maxWidth768()
background: none !important;

#page-header #nav #site-name,
#page-header #nav #toggle-menu,
#page-header:not(.not-top-img) #nav .back-home-button
+maxWidth768()
color: var(--font-color) !important;

#blog_name,
.mask-name-container,
#menus,
#nav-right .nav-button,
#nav-right #toggle-menu
a
+maxWidth768()
color: var(--font-color) !important;

div#bbTimeList
+maxWidth768()
margin: 20px 15px !important;


## 第二步：添加样式与 JS 文件

### 在 source/static/css 目录添加 index_media.css

`

```
/* index */

  #home-media-container {
    position: fixed; /* 改为固定定位 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
  
    /* 添加底部向上渐变遮罩 */
    -webkit-mask-image: linear-gradient(to top, transparent 0%, black 0%);
    mask-image: linear-gradient(to top, transparent 0%, black 0%);
  }
  
  .home-media {
    position: fixed; /* 同步改为固定定位 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  
    /* 添加透明度过渡 */
    transition: opacity 0.5s ease;
    opacity: 1;
  }
  
    /* 自定义加载动画容器 */
  .custom-loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10; /* 确保在视频上方 */
    pointer-events: none; /* 防止阻挡视频交互 */
    transition: opacity 0.5s ease; /* 淡出动画 */
  }

  /* 加载动画元素 */
  .loader-animation {
    width: 18%;
    height: 18%;
    min-width: 128px;
    min-height: 128px;
    background-size: contain; /* 保持比例 */
    background-position: center;
    background-repeat: no-repeat;
    animation: pulse 1.5s infinite ease-in-out;
  }

  /* 呼吸动画效果 */
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }


````

### 在 source/static/js 目录添加 index_media.js

`

```
// ======================= 横竖屏自适应背景媒体加载器 =======================
let lastOrientation = null; // 记录上一次的方向状态

// ================= 新增滚动渐变效果函数 =================
function initScrollFadeEffect() {
  const mediaContainer = document.getElementById('home-media-container');
  if (!mediaContainer) return;
  
  const mediaElement = mediaContainer.querySelector('.home-media');
  if (!mediaElement) return;
  
  // 节流函数优化性能
  function throttle(func, limit) {
    let lastFunc, lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    }
  }

  // 处理滚动时的透明度变化
  function handleScrollFade() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
  
    // 计算透明度：从1（完全不透明）到0（完全透明）
    // 当滚动到一屏高度时，透明度变为0
    let opacity = 1 - (scrollY / windowHeight);
    opacity = Math.max(0, Math.min(1, opacity)); // 限制在0-1范围
  
    mediaElement.style.opacity = opacity;
  }

  // 节流处理滚动事件（每50ms检查一次）
  const throttledScrollHandler = throttle(handleScrollFade, 50);
  
  // 添加滚动监听
  window.addEventListener('scroll', throttledScrollHandler);
  
  // 初始化时执行一次
  handleScrollFade();
  
  // 存储当前滚动处理器以便后续移除
  return throttledScrollHandler;
}


// ================= 滚动渐变效果函数结束 =================

// ================= 新增底部遮罩层控制函数 =================
function initScrollMaskEffect() {
  const mediaContainer = document.getElementById('home-media-container');
  if (!mediaContainer) return;
  
  // 节流函数优化性能
  function throttle(func, limit) {
    let lastFunc, lastRan;
    return function() {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    }
  }

  // 处理滚动时的遮罩变化
  function handleScrollMask() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
  
    // 计算遮罩高度（0-100%）
    let maskHeight = (scrollY / windowHeight) * 100;
    maskHeight = Math.min(100, Math.max(0, maskHeight));
  
    // 动态设置遮罩层高度
    mediaContainer.style.setProperty('--mask-height', `${maskHeight}%`);
  }

  // 节流处理滚动事件（每50ms检查一次）
  const throttledScrollHandler = throttle(handleScrollMask, 50);
  
  // 添加滚动监听
  window.addEventListener('scroll', throttledScrollHandler);
  
  // 初始化时执行一次
  handleScrollMask();
  
  // 返回处理器以便后续移除
  return throttledScrollHandler;
}


function initResponsiveBackground() {
  const mediaContainer = document.getElementById('home-media-container');
  if (!mediaContainer) {
    console.error('[背景加载器] 未找到媒体容器元素');
    return;
  }

  // 检测当前屏幕方向
  const currentIsPortrait = window.innerHeight > window.innerWidth;
  const currentOrientation = currentIsPortrait ? 'portrait' : 'landscape';
  
  // 如果方向未改变，则直接返回
  if (lastOrientation === currentOrientation) {
    console.log('[背景加载器] 方向未改变，无需重新加载');
    return;
  }
  
  // 更新方向记录
  lastOrientation = currentOrientation;
  console.log(`[背景加载器] 方向变化: ${currentOrientation}`);

  // 清除现有媒体元素和加载动画
  const existingMedia = mediaContainer.querySelector('.home-media');
  const existingLoader = mediaContainer.querySelector('.custom-loader');
  if (existingMedia) existingMedia.remove();
  if (existingLoader) existingLoader.remove();

  // 根据方向选择资源
  let mediaSrc, posterSrc, mediaType;
  if (currentIsPortrait) {
    mediaSrc = mediaContainer.dataset.portraitVideo || mediaContainer.dataset.portraitImg;
    posterSrc = mediaContainer.dataset.portraitPoster;
    mediaType = mediaContainer.dataset.portraitVideo ? 'video' : 'img';
  } else {
    mediaSrc = mediaContainer.dataset.landscapeVideo || mediaContainer.dataset.landscapeImg;
    posterSrc = mediaContainer.dataset.landscapePoster;
    mediaType = mediaContainer.dataset.landscapeVideo ? 'video' : 'img';
  }

  if (!mediaSrc) {
    console.error('[背景加载器] 未找到有效媒体资源');
    return;
  }

  console.log(`[背景加载器] 使用资源: ${mediaSrc} (类型: ${mediaType})`);

  // 创建媒体元素
  const mediaElement = document.createElement(mediaType);
  mediaElement.className = 'home-media';
  mediaElement.style.cssText = 'width:100%;height:100%;object-fit:cover';
  
  // ================= 设置初始透明度 =================
  mediaElement.style.opacity = '1';
  mediaElement.style.transition = 'opacity 0.5s ease';
  // ================================================
  
  // 在媒体容器添加媒体元素后调用效果函数
  mediaContainer.appendChild(mediaElement);
  addMediaEffects(mediaElement, mediaType); // 添加新功能
   
  console.log('[背景加载器] 媒体元素已创建');
   
  // 创建自定义加载动画容器
  const loaderContainer = document.createElement('div');
  loaderContainer.className = 'custom-loader';
  mediaContainer.prepend(loaderContainer);
  
  // 创建加载动画元素
  const loaderElement = document.createElement('div');
  loaderElement.className = 'loader-animation';
  
  // 设置加载动画样式（使用GIF）
  loaderElement.style.backgroundImage = `url(${posterSrc})`;
  loaderContainer.appendChild(loaderElement);
  
  // 视频特殊处理
  if (mediaType === 'video') {
    mediaElement.autoplay = true;
    mediaElement.muted = true;
    mediaElement.loop = true;
    mediaElement.playsInline = true;
    mediaElement.setAttribute('playsinline', '');
    mediaElement.setAttribute('webkit-playsinline', '');
  
    // 多源支持
    const source = document.createElement('source');
    source.src = mediaSrc;
    source.type = 'video/mp4';
    mediaElement.appendChild(source);
  
    // 处理自动播放限制
    const playPromise = mediaElement.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('[背景加载器] 自动播放被阻止:', error);
        mediaElement.muted = true;
        mediaElement.play();
      });
    }
  
    // 视频加载完成后移除加载动画
    mediaElement.addEventListener('loadeddata', () => {
      loaderContainer.style.opacity = '0';
      setTimeout(() => {
        if (loaderContainer.parentNode) {
          loaderContainer.parentNode.removeChild(loaderContainer);
        }
      }, 500); // 淡出动画持续时间
    });
  } else {
    mediaElement.src = mediaSrc;
    mediaElement.loading = 'eager';
  
    // 图片加载完成后移除加载动画
    mediaElement.addEventListener('load', () => {
      loaderContainer.style.opacity = '0';
      setTimeout(() => {
        if (loaderContainer.parentNode) {
          loaderContainer.parentNode.removeChild(loaderContainer);
        }
      }, 500);
    });
  }

  // 错误处理
  mediaElement.onerror = function() {
    console.error(`[背景加载器] 资源加载失败: ${mediaSrc}`);
    this.style.display = 'none';
  
    // 尝试回退到备用类型
    console.warn('[背景加载器] 尝试回退到备用媒体');
    const fallbackType = mediaType === 'video' ? 'img' : 'video';
    const fallbackSrc = currentIsPortrait ? 
      (mediaContainer.dataset.portraitImg || mediaContainer.dataset.portraitVideo) :
      (mediaContainer.dataset.landscapeImg || mediaContainer.dataset.landscapeVideo);
  
    if (fallbackSrc && fallbackSrc !== mediaSrc) {
      console.log(`[背景加载器] 使用备用资源: ${fallbackSrc}`);
      mediaElement.src = fallbackSrc;
      mediaElement.style.display = 'block';
    }
  };

  mediaContainer.appendChild(mediaElement);
  console.log('[背景加载器] 媒体元素已创建');
  
  // ================= 初始化滚动渐变效果 =================
  initScrollFadeEffect();
}

function addMediaEffects(mediaElement, mediaType) {
  if (mediaType === 'video') {
    // 获取当前方向
    const currentIsPortrait = window.innerHeight > window.innerWidth;

    // 竖屏模式下固定放大105%
    const baseScale = currentIsPortrait ? 1.05 : 1.2;
    mediaElement.style.transform = `scale(${baseScale})`;
  
    // 检测是否为iOS设备
    function isIOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    // 如果是iOS设备，直接禁用所有视差效果
    if (isIOS()) {
      console.log('[视差效果] 在iOS设备上，禁用所有视差效果');
      return; // 直接返回，不初始化任何视差效果
    }
    // 1. 添加缩放动画效果
    mediaElement.style.transform = 'scale(1.2)'; // 初始放大110%
    mediaElement.style.transition = 'transform 0.5s ease-out';
  
    // 在视频加载完成后触发缩放动画
    mediaElement.addEventListener('loadeddata', () => {
      // 竖屏模式保持105%缩放，不需要动画
      if (currentIsPortrait) {
        mediaElement.style.transform = 'scale(1.05)';
      } 
      // 横屏模式执行缩放动画到正常大小
      else {
        setTimeout(() => {
          mediaElement.style.transform = 'scale(1)';
        }, 100);
      }
    });
  
    // 2. 添加视差效果（鼠标/陀螺仪）
    const mediaContainer = document.getElementById('page-header');
    mediaContainer.style.overflow = 'hidden';
    mediaElement.style.transformOrigin = 'center center';
  
    // 视差效果参数
    const parallaxIntensity = 0.05;
    const scaleIntensity = 0.05;
    let isGyroActive = false;
  
    // ================= 新增陀螺仪支持 =================
    // 检测陀螺仪支持
    function initGyroParallax() {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ 需要权限
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              setupGyroListeners();
              isGyroActive = true;
            }
          })
          .catch(console.error);
      } else if ('DeviceOrientationEvent' in window) {
        // Android和其他支持设备
        setupGyroListeners();
        isGyroActive = true;
      }
  
      return isGyroActive;
    }
  
    // 设置陀螺仪监听
    function setupGyroListeners() {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  
    // 处理陀螺仪数据
    function handleOrientation(event) {
      // 竖屏模式使用105%基础缩放
      const baseScaleValue = currentIsPortrait ? 1.05 : 1;
      if (!isGyroActive) return;
  
      // 获取陀螺仪数据（beta: 前后倾斜, gamma: 左右倾斜）
      const beta = event.beta || 0;  // 前后倾斜（-180到180）
      const gamma = event.gamma || 0; // 左右倾斜（-90到90）
  
      // 将角度转换为百分比偏移（归一化处理）
      const moveX = (gamma / 90) * parallaxIntensity * 100; // -100% 到 100%
      const moveY = (beta / 180) * parallaxIntensity * 100; 
  
      // 应用视差效果
      mediaElement.style.transform = `
        translate(${moveX}%, ${moveY}%)
        scale(${baseScaleValue + scaleIntensity})
      `;
    }
  
    // ================= 鼠标视差效果 =================
    function initMouseParallax() {
      mediaContainer.addEventListener('mousemove', (e) => {
        const rect = mediaContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
    
        const moveX = (x - 0.5) * parallaxIntensity * 100;
        const moveY = (y - 0.5) * parallaxIntensity * 100;
    
        mediaElement.style.transform = `
          translate(${moveX}%, ${moveY}%)
          scale(${1 + scaleIntensity})
        `;
      });
  
      mediaContainer.addEventListener('mouseleave', () => {
        mediaElement.style.transform = 'scale(1)';
      });
    }
  
    // ================= 根据设备类型初始化 =================
    // 检测移动设备
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  
    if (isMobile) {
      // 移动设备优先使用陀螺仪
      if (!initGyroParallax()) {
        // 不支持陀螺仪则回退到触摸事件
        initTouchParallax();
      }
    } else {
      // PC设备使用鼠标事件
      initMouseParallax();
    }
  
    // ================= 触摸事件回退方案 =================
    function initTouchParallax() {
      mediaContainer.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = mediaContainer.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width;
        const y = (touch.clientY - rect.top) / rect.height;
    
        const moveX = (x - 0.5) * parallaxIntensity * 50; // 移动强度减半
        const moveY = (y - 0.5) * parallaxIntensity * 50;
    
        mediaElement.style.transform = `
          translate(${moveX}%, ${moveY}%)
          scale(${1 + scaleIntensity * 0.5}) // 缩放强度减半
        `;
      });
  
      mediaContainer.addEventListener('touchend', () => {
        mediaElement.style.transform = 'scale(1)';
      });
    }
  
    // ================= 性能优化 =================
    // 页面不可见时暂停陀螺仪
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        isGyroActive = false;
      } else if (isMobile) {
        isGyroActive = initGyroParallax();
      }
    });
  }
}

// 在initMedia函数中调用新功能
function initMedia() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initResponsiveBackground();
      initScrollFadeEffect(); // 添加调用
    });
  } else {
    initResponsiveBackground();
    initScrollFadeEffect(); // 添加调用
  }
}


// ======================= 执行入口 =======================
initMedia();

// 防抖处理窗口变化
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // 计算当前方向状态
    const currentIsPortrait = window.innerHeight > window.innerWidth;
    const currentOrientation = currentIsPortrait ? 'portrait' : 'landscape';
  
    // 只有方向实际改变时才执行重载
    if (lastOrientation !== currentOrientation) {
      console.log('[背景加载器] 窗口大小变化，重新加载媒体');
      initResponsiveBackground();
    } else {
      console.log('[背景加载器] 窗口大小变化但方向未改变');
      // ================= 方向未变时重置透明度 =================
      initScrollFadeEffect();
    }
  }, 500);
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    const video = document.querySelector('#home-media-container video');
    if (video && video.paused) {
      console.log('[背景加载器] 页面恢复可见，重新播放视频');
      video.play().catch(e => console.warn('视频恢复播放失败:', e));
    }
    // ================= 页面恢复可见时重置透明度 =================
    initScrollFadeEffect();
  }
});

// ========== 新增修复代码（直接加在现有代码后面） ========== //

// 1. 缓存恢复检测（核心修复）
window.addEventListener('pageshow', event => {
  if (event.persisted && location.pathname === '/') {
    console.log('[修复] 检测到缓存恢复主页，强制重置');
    lastOrientation = null;
    initResponsiveBackground();
    // ================= 缓存恢复时重置透明度 =================
    setTimeout(initScrollFadeEffect, 300);
  }
});

// 2. 路由变化监听（SPA兼容）
window.addEventListener('popstate', () => {
  if (location.pathname === '/') {
    console.log('[修复] 检测到返回主页');
    setTimeout(() => {
      // 检查媒体元素是否存在
      const container = document.getElementById('home-media-container');
      if (!container?.querySelector('.home-media')) {
        lastOrientation = null;
        initResponsiveBackground();
      }
      // ================= 返回主页时重置透明度 =================
      initScrollFadeEffect();
    }, 300); // 延迟确保DOM更新
  }
});

// 3. 媒体状态自检（兜底方案）
function checkMediaStatus() {
  if (location.pathname !== '/') return;
  
  const container = document.getElementById('home-media-container');
  if (!container) return;
  
  const hasMedia = container.querySelector('.home-media');
  if (!hasMedia) {
    console.log('[修复] 自检发现媒体丢失');
    lastOrientation = null;
    initResponsiveBackground();
  }
  // ================= 媒体自检时重置透明度 =================
  initScrollFadeEffect();
}

// 每0.5秒检查一次（轻量级检测）
setInterval(checkMediaStatus, 500);

// 4. 增强错误处理（在initResponsiveBackground函数内修改）
// 在mediaElement.onerror函数内添加：
setTimeout(() => {
  if (!mediaElement.parentNode) {
    console.warn('[修复] 尝试完全重建');
    lastOrientation = null;
    initResponsiveBackground();
    // ================= 错误重建时重置透明度 =================
    setTimeout(initScrollFadeEffect, 500);
  }
}, 1000);


````


## 第三步：插入样式

### 在_config.anzhiyu.yml 文件中搜索 index_img 配置项替换新的配置项

> 替换前

`

```
    # The banner image of home page
index_img: false # "background: url() top / cover no-repeat"
````


> 替换后，其中两个 path 与 vpath 为我临时演示效果路径，不介意也可直接使用。注意两个 enable 只能打开其一为 true, 两者都为 false 时关闭 Top 壁纸为安知鱼默认效果。

`

```
    # The banner image of home page

# 首页媒体配置

index_img:

  enable: false

  path: https://tc.ayakasuki.com/a/2025/06/11/biji684950edcabc4.png

  vpath: https://tc.ayakasuki.com/a/2025/06/11/biji684950efea626.png

  

index_video:

  enable: true # 视频总开关

  path: https://yun.ayakasuki.com/index.php?explorer/share/file&hash=f97fiWtCSKo12h0pq2dKR5w2QEFNZA3UamrI9ZLGp22ZV6NoEITHrMMyPAKTkXlOktdVLA

  poster: https://tc.ayakasuki.com/a/2025/06/11/biji68495015b3481.gif # 视频加载时动画

  vpath: https://yun.ayakasuki.com/index.php?explorer/share/file&hash=9f25EPDmi9bScfWMCm_r061iw-lKwpKEaT6OZzv7dUyBSh75x_4KrNHSuaD6VW2ehSl-xw  # 新增竖屏视频

  vposter: https://tc.ayakasuki.com/a/2025/06/11/biji68495015b3481.gif  # 竖屏视频加载时动画


````

> 在_config.anzhiyu.yml 文件中搜索 inject 配置项，在 head 中插入 CSS 和 JS

`

```
    - <script src="/static/js/index_media.js"></script> #index_img和index_video自适应入口文件

    - <link rel="stylesheet" href="/static/css/index_media.css"> #index_img和index_video入口文件配套css
````


最后执行三部曲即可查看效果！

`hexo cl && hexo g && hexo s`
