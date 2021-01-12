// 传入 当前图片 dom
import { v4 as uuid } from 'uuid'
/**
 * 预览大图
 * @param dom 当前缩略图 dom
 * @param items  所有元素 [unique_id: '', width: 100, height: 100, url: 'http://....']
 */
class ImagePreview {
    constructor() {
        this.overlay = null
        this.dom = null
        this.initDom = null
        this.originRect = {}
        this.init = true
        this.overlayId = uuid()
        this.overlayStyle =
            'background-color: rgba(229, 231, 235, .9); position: fixed; top: -100%; left: 0; bottom: -100%; right: 0; opacity: .9; z-index: 66;cursor:pointer;'
    }

    /**
     *  初始化
     *  @params dom 当前点击的元素
     */
    initPreview(dom, items) {
        this.initDom = dom
        this.dom = dom
        this.init = true
        const data = dom.dataset
        this.originRect = dom.getBoundingClientRect()
        this.items = this.getItems(items)
        this.hasItems = this.items.length >= 2
        let index = 0
        for (let i = 0; i < this.items.length; i++) {
            const eleData = this.items[i].dataset
            if (eleData.id === data.id) {
                index = i
            }
        }
        this.createOverlayElement()
        this.setCurrentDom(index)
    }

    /**
     *
     * @param index 更改点击元素
     */
    setCurrentDom(index) {
        this.currentIndex = index
        this.dom = this.items[index]
        this.createCoverElement()
        if (!this.hasNext()) {
            document.getElementById('preview-next').style.display = 'none'
        } else {
            document.getElementById('preview-next').style.display = 'block'
        }
        if (!this.hasPrev()) {
            document.getElementById('preview-prev').style.display = 'none'
        } else {
            document.getElementById('preview-prev').style.display = 'block'
        }
    }

    /**
     * 取得同级的 dom
     */
    getItems(items) {
        if (items === undefined) {
            return [this.dom]
        }
        return items
    }

    /**
     * 获取将要显示的图片地址
     */
    getSrc(dom) {
        if (dom.src) return dom.src
        return dom.dataset.src
    }

    getWindowSize() {
        const windowHeight = window.innerHeight // 窗口高度
        const windowWidth = window.innerWidth
        return { windowHeight, windowWidth }
    }

    getPreviewBoxOffset() {
        return {
            left: 100,
            right: 100,
            top: 10,
            bottom: 10,
        }
    }

    /**
     * 获取图片的缩放值
     * @param width 图片的真实尺寸宽度
     * @param height 图片的真实高度
     * @returns {{x: number, y: number}}
     */
    getImageResetRatio(width, height) {
        // 获取预览框位置
        const { left, top, right, bottom } = this.getPreviewBoxOffset()
        const { windowHeight, windowWidth } = this.getWindowSize()
        // 实际可使用的盒子大小
        const innerBoxHeight = windowHeight - top - bottom
        const innerBoxWidth = windowWidth - left - right
        // 图片可以完整的放在盒子里
        const ratioX = innerBoxWidth / width
        const ratioY = innerBoxHeight / height
        if (height <= innerBoxHeight && width <= innerBoxWidth) {
            return { x: 1, y: 1 }
        } else if (ratioX < ratioY) {
            // 无法完整放入，分别获取宽高的缩放比例
            return { x: ratioX, y: ratioX }
        } else {
            return { x: ratioY, y: ratioY }
        }
    }

    /**
     * 获取即将显示的图片的位置
     *
     * @params originDom 初始变化的dom
     * @returns {{rect: DOMRect, scale: {x: number, y: number}, translate: {x: number, y: number}}}
     */
    getImagePosition(dom = null) {
        const currentDom = dom || this.dom
        const rect = currentDom.getBoundingClientRect()
        // 原图尺寸
        const imageRealWidth = currentDom.getAttribute('data-width')
        const imageRealHeight = currentDom.getAttribute('data-height')
        const previewOffset = this.getPreviewBoxOffset()
        const windowSize = this.getWindowSize()
        const imageRatio = this.getImageResetRatio(
            imageRealWidth,
            imageRealHeight
        )
        const positionY =
            previewOffset.top +
            (windowSize.windowHeight -
                previewOffset.top -
                previewOffset.bottom) /
                2
        const positionX =
            previewOffset.left +
            (windowSize.windowWidth -
                previewOffset.left -
                previewOffset.right) /
                2
        // 要进行的移动
        const translateX = positionX - (rect.left + rect.width / 2)
        const translateY = positionY - (rect.top + rect.height / 2)
        // 缩放
        const scaleY = (imageRatio.y * imageRealHeight) / rect.height
        const scaleX = (imageRatio.x * imageRealWidth) / rect.width
        return {
            translateX,
            translateY,
            scaleX,
            scaleY,
            showHeight: imageRatio.y * imageRealHeight,
            showWidth: imageRatio.x * imageRealWidth,
        }
    }

    /**
     * 要应该用在 图片框上的样式
     */
    setPreviewImageElementStyle(dom = null) {
        const i = dom || document.getElementById('preview')
        const src = this.getSrc(this.dom)
        i.style =
            'transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);transition-duration: 150ms;'
        i.style.backgroundImage = `url('${src}')`
        i.style.backgroundSize = '100% 100%'
        i.style.backgroundPosition = '50%'
        i.style.backgroundRepeat = 'no-repeat'
        i.style.position = 'fixed'
        i.style.zIndex = 99
        i.style.opacity = 1
        i.style.transformOrigin = 'center center 0'
        const rect = this.originRect
        const miniRect = this.items[this.currentIndex].getBoundingClientRect()
        i.style.top = `${rect.top}px`
        i.style.left = `${rect.left}px`
        i.style.width = `${miniRect.width}px`
        i.style.height = `${miniRect.height}px`
    }

    /**
     * 创建一个虚拟的 dom 覆盖在原图之上
     */
    createCoverElement() {
        if (!document.getElementById('preview')) {
            const div = document.createElement('div')
            div.setAttribute('id', 'preview')
            document.body.append(div)
        }
        const insertElement = document.getElementById('preview')
        this.setPreviewImageElementStyle()
        // 覆盖之后
        if (this.init) {
            this.dom.style.opacity = 0
        }
        this.imageBoxElement = insertElement
        // 改变样式
        // 计算出 变换的位置
        const p = this.getImagePosition()
        setTimeout(() => {
            insertElement.style.transform = `translate(${p.translateX}px, ${p.translateY}px) scale(${p.scaleX}, ${p.scaleY})`
        })
    }

    createOverlayElement() {
        if (!document.getElementById(this.overlayId)) {
            const overlayElement = document.createElement('div')
            overlayElement.setAttribute('id', this.overlayId)
            overlayElement.setAttribute('class', 'transition')
            overlayElement.style = this.overlayStyle
            if (!document.getElementById('preview-next')) {
                overlayElement.innerHTML = `
              <div style="position:absolute; left:0; top:50%; color: #000; font-size: 24px; padding-left: 16px;" id="preview-prev"><i class="fa fa-arrow-left"></i></div>
              <div style="position:absolute; right:0; top:50%; color: #000; font-size: 24px; padding-left: 16px;" id="preview-next"><i class="fa fa-arrow-right"></i></div>`
            }
            document.body.append(overlayElement)
            this.overlay = overlayElement
        }
        this.nextElement = document.getElementById('preview-next')
        this.prevElement = document.getElementById('preview-prev')
        this.nextElement.addEventListener('click', (event) => {
            event.stopPropagation()
            this.next()
        })
        this.prevElement.addEventListener('click', (event) => {
            event.stopPropagation()
            this.prev()
        })
        this.overlay.addEventListener('click', () => {
            this.close()
        })
    }

    close() {
        this.overlay.style = this.overlayStyle + 'display: none;'
        // 关闭的时候还得变回去 `-`
        this.setClosedStyle()
        // this.imageBoxElement.remove();
        this.overlay.removeEventListener('click', () => {})
        this.overlay.remove()
    }

    /**
     * 关闭应该用样式
     */
    setClosedStyle() {
        // 当前大图位置
        const previewRect = this.imageBoxElement.getBoundingClientRect()
        // 小图的位置
        const miniRect = this.items[this.currentIndex].getBoundingClientRect()
        // 计算出要应用的变换
        // 已经变换的样式
        const transformArray = document.defaultView
            .getComputedStyle(this.imageBoxElement)
            .transform.replace('matrix(', '')
            .replace(')', '')
            .replace(' ', '')
            .split(',')
        const usedTranslateX = transformArray[4]
        const usedTranslateY = transformArray[5]
        const usedScaleX = transformArray[0]
        const usedScaleY = transformArray[3]
        // const previewOffset = this.getPreviewBoxOffset();
        // 小图的高度中心点
        const miniCenterTop = miniRect.top + miniRect.height / 2
        // 大图的高度中心点
        const previewCenterTop =
            previewRect.top + (miniRect.height * usedScaleY) / 2
        // 小图左侧中心
        const miniCenterLeft = miniRect.left + miniRect.width / 2
        // 大图左侧中心点
        const previewCenterLeft =
            previewRect.left + (miniRect.width * usedScaleX) / 2
        const translateX =
            miniCenterLeft - previewCenterLeft + parseFloat(usedTranslateX)
        const translateY =
            miniCenterTop - previewCenterTop + parseFloat(usedTranslateY)
        // 只应用缩放
        this.imageBoxElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(1, 1)`
        this.initDom.style.opacity = 1
        setTimeout(() => {
            this.imageBoxElement.style.zIndex = -999
        }, 250)
    }

    /**
     * 切换显示下一张
     */
    next() {
        this.init = false
        this.originRect = this.items[
            this.currentIndex + 1
        ].getBoundingClientRect()
        this.setPreviewImageElementStyle()
        this.setCurrentDom(this.currentIndex + 1)
    }

    /**
     * 切换显示上一张
     */
    prev() {
        this.init = false
        this.originRect = this.items[
            this.currentIndex - 1
        ].getBoundingClientRect()
        this.setPreviewImageElementStyle()
        this.setCurrentDom(this.currentIndex - 1)
    }

    /**
     * 是否有下一张
     * @returns {boolean}
     */
    hasNext() {
        return this.hasItems && this.currentIndex < this.items.length - 1
    }

    /**
     * 是否有上一张
     */
    hasPrev() {
        return this.hasItems && this.currentIndex > 0
    }
}
export default () => {
    return new ImagePreview()
}
