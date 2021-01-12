const ImagePreview = require('../../src/image').default
window.addEventListener('DOMContentLoaded', () => {
  window.imagePreview = (dom, items) => {
    ImagePreview().initPreview(dom, items)
  }
})
