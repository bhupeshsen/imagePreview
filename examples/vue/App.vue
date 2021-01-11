<template>
  <div>
  <div class="bg-blue-400 bg-gradient-to-br p-4 w-full shadow">
    <h1 class="text-white">顶部区域</h1>
  </div>
  <div class="container mx-auto">
    <div class="max-w-4xl mx-auto mt-6">
      <div class="sm:p-6 bg-white shadow overflow-hidden rounded-lg mt-6" id="app">
        <h3 class="font-semibold text-xl">{{message}}</h3>
        <div class="text-sm bg-red-500 text-white p-4 my-6">{{ notice }}</div>
        <div class="flex flex-wrap" ref="image-container">
          <template v-for="(item, index) in images">
            <img
                :style="`width: ${parseInt(Math.random() * 300 + 100)}px; height: ${parseInt(Math.random() * 300 + 100)}px;`"
                :data-width="item.width"
                :data-height="item.height"
                :ref="`item-${index}`"
                @click="showImages($refs[`item-${index}`])"
                :src="item.url"
                class="item m-2"
                :data-id="`image-${index}`"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import showImages from '../../src/image.js'
export default {
  data:() => ({
    message: 'ImagePreview Vue!',
    notice: '这个演示页面仅用于基础的演示及 webpack 简单的配置学习。Vue 的正确用法请查看文档。',
    images: [
      {
        code: "200",
        height: "1080",
        url: "https://tva1.sinaimg.cn/large/0072Vf1pgy1foxk782lbsj31hc0u0tr4.jpg",
        width: "1920"
      },
      {
        height: "1080",
        url: "https://tva4.sinaimg.cn/large/0072Vf1pgy1foxkj7vgb3j31hc0u0nhs.jpg",
        width: "1920"
      },
      {
        height: "1152",
        url: "https://tva1.sinaimg.cn/large/0072Vf1pgy1foxkd6lx6jj31kw0w0wyb.jpg",
        width: "2048"
      },
      {
        height: "1200",
        url: "https://tva1.sinaimg.cn/large/87c01ec7gy1frkis8v9alj21hc0xcazc.jpg",
        width: "1920"
      },
      {
        height: "1080",
        url: "https://tva2.sinaimg.cn/large/0072Vf1pgy1foxkft70qtj31hc0u0tqy.jpg",
        width: "1920"
      }
    ]
  }),
  methods: {
    showImages(dom) {
      const items = document.querySelectorAll('.item')
      showImages().initPreview(dom[0], items)
    }
  },
}
</script>
