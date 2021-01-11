# ImagePreview

一个附带简单动画效果的图片预览组件

- [Demo / 在线演示](https://fengzi91.github.io/imagePreview/examples/basic/)

### 使用

- use cdn
```
<script src="//cdn.jsdelivr.net/gh/fengzi91/imagepreview@main/dist/image_preview.js"></script>
```
```javascript
// add on click event
imagePreview().initPreview(dom, items)
```
|参数|是否必须|默认值|说明|
|----|----|----|----|
|dom|是|当前要显示的图片所在 Dom|该元素必须包含 data-id(唯一 id)、data-src(或 src，图像地址)、data-width (图像宽度)、data-height (图片高度) 四个属性|
|items|否|null|NodeList[] 包含了可以一组图片 Dom|

### License
------------
[The MIT License (MIT)](LICENSE).
