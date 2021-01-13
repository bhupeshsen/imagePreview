import './src/style/index.css'
// const ImagePreview =
require('../../dist/image_preview')
window.showImages = (dom, items) => {
  window.ImagePreview().initPreview(dom, items)
}
