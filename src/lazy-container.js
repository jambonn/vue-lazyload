import { remove } from './util'

const defaultOptions = {
  selector: 'img',
}

class LazyContainer {
  constructor({ el, binding, lazy }) {
    this.el = null
    this.binding = binding
    this.options = {}
    this.lazy = lazy

    this.update({ el, binding })
  }

  update({ el, binding }) {
    this.el = el
    this.options = Object.assign({}, defaultOptions, binding.value)

    const imgs = this.getImgs()
    imgs.forEach(el => {
      this.lazy.add(
        el,
        Object.assign({}, this.binding, {
          value: {
            src: 'dataset' in el ? el.dataset.src : el.getAttribute('data-src'),
            error:
              ('dataset' in el
                ? el.dataset.error
                : el.getAttribute('data-error')) || this.options.error,
            loading:
              ('dataset' in el
                ? el.dataset.loading
                : el.getAttribute('data-loading')) || this.options.loading,
          },
        }),
      )
    })
  }

  getImgs() {
    return Array.from(this.el.querySelectorAll(this.options.selector))
  }

  clear() {
    const imgs = this.getImgs()
    imgs.forEach(el => this.lazy.remove(el))

    this.binding = null
    this.lazy = null
  }
}

export default class LazyContainerMananger {
  constructor({ lazy }) {
    this.lazy = lazy
    this._queue = []
  }

  bind(el, binding) {
    const container = new LazyContainer({ el, binding, lazy: this.lazy })
    this._queue.push(container)
  }

  update(el, binding) {
    const container = this._queue.find(item => item.el === el)
    if (!container) return
    container.update({ el, binding })
  }

  unbind(el) {
    const container = this._queue.find(item => item.el === el)
    if (!container) return
    container.clear()
    remove(this._queue, container)
  }
}
