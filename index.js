class M_touchMove {
    constructor (data) {
        this.data = data
        this.throData = { // 节流作用域
            timer: null,
            t_start: null
        }
        this.D = document
        this.W = window
        this.$ = (dom) => (this.D.getElementById(dom))
        this._C = (p_dom, klass) => (p_dom.getElementsByClassName(klass))
        this._S = (p_dom, c_dom) => (p_dom.getComputedStyle(c_dom, null))
        this.init()
    }
    init () {
        let {
            el,
            child
        } = this.data
        const d = this.$(el)
        if (!d) {
            console.warn('父级dom为空')
            return
        }
        const c_d = this._C(d, child)[0]
        let touchStart = {}
        let _x = 0, _y = 0
        let touchmove = (e) => {
            e = window.e || e
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true
            this.throttle(() => {
                let touch = e.targetTouches[0]
                let x = _x + (touch.pageX - touchStart.pageX)
                let y = _y + (touchStart.pageY - touch.pageY)
                c_d.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`
                console.log('MOVE')
            }, 35, 80) // TODO 如果有性能问题，在这里微调
        }
        let touchstart = (e) => {
            e = window.e || e
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true
            touchStart = e.targetTouches[0]
            let c_d_s = c_d.attributes['style']
            if (c_d_s) {
                c_d_s = c_d_s.value
                let rotateY = c_d_s.indexOf('rotateY(') + 8
                let rotateX = c_d_s.lastIndexOf('rotateX(') + 8
                _x = +c_d_s.substring(rotateY, c_d_s.indexOf(')', rotateY) - 3)
                _y = +c_d_s.substring(rotateX, c_d_s.indexOf(')', rotateX) - 3)
            }
            console.log('START')
            d.addEventListener('touchmove', touchmove, false)
        }
        let touchend = (e) => {
            e = window.e || e
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true
            console.log('END')
            d.removeEventListener('touchmove', touchmove)
        }
        d.addEventListener("touchend", touchend, false)
        d.addEventListener("touchstart", touchstart, false)
    }
    throttle (fn, delay, mustDelay) { // 节流单独封装
        let context = this.throttle
        let args = arguments
        let t_cur = +new Date()
        clearTimeout(this.throData.timer)
        if (!this.throData.t_start) {
          this.throData.t_start = t_cur
        }
        if (t_cur - this.throData.t_start >= mustDelay) {
          fn.apply(context, args)
          this.throData.t_start = t_cur
        }
        else {
          this.throData.timer = setTimeout(() => {
            fn.apply(this, args)
          }, delay)
        }
    }
}
