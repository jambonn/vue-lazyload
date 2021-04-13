import Lazy from './lazy'
import LazyComponent from './lazy-component'
import LazyContainer from './lazy-container'
import LazyImage from './lazy-image'

export default {
  /**
   * install function
   * @param app
   * @param options
   */
  install(app, options = {}) {
    const vueVersion = Number(app.version.split('.')[0])
    if (vueVersion < 3) {
      return new Error('Vue version at least 3.0')
    }

    const LazyClass = Lazy(app)
    const lazy = new LazyClass(options)
    const lazyContainer = new LazyContainer({ lazy })

    app.provide('Lazyload', lazy)
    app.config.globalProperties.$Lazyload = lazy

    if (options.lazyComponent) {
      app.component('lazy-component', LazyComponent(lazy))
    }

    if (options.lazyImage) {
      app.component('lazy-image', LazyImage(lazy))
    }

    app.directive('lazy', {
      beforeMount: lazy.add.bind(lazy),
      beforeUpdate: lazy.update.bind(lazy),
      updated: lazy.lazyLoadHandler.bind(lazy),
      unmounted: lazy.remove.bind(lazy),
    })
    app.directive('lazy-container', {
      beforeMount: lazyContainer.bind.bind(lazyContainer),
      updated: lazyContainer.update.bind(lazyContainer),
      unmounted: lazyContainer.unbind.bind(lazyContainer),
    })
  },
}

export { Lazy, LazyComponent, LazyImage, LazyContainer }
