# Vue-Lazyload
Vue module for lazyloading images in your Vue 3 applications. This module is base on vue-lazyload. Vue 1.x or 2.x please use [vue-lazyload](https://github.com/hilongjw/vue-lazyload). Some of goals of this project worth noting include:

* Be lightweight, powerful and easy to use
* Work on any image type
* Add loading class while image is loading
* Supports Vue 3

# Table of Contents

* [___Requirements___](#requirements)
* [___Installation___](#installation)
* [___Usage___](#usage)
* [___Constructor Options___](#constructor-options)
* [___Implementation___](#implementation)
    * [___Basic___](#basic)
    * [___Css state___](#css-state)
* [___Methods___](#methods)
    * [__Event hook__](#event-hook)
    * [__LazyLoadHandler__](#lazyloadhandler)
    * [__Performance__](#performance)
* [___Authors && Contributors___](#authors-&&-Contributors)
* [___License___](#license)

# Requirements

- [Vue.js](https://github.com/vuejs/vue-next) `3.x`

# Installation

## npm

```bash

$ npm i @jambonn/vue-lazyload

```

## yarn

```bash

$ yarn add @jambonn/vue-lazyload

```

## CDN

CDN: [https://unpkg.com/@jambonn/vue-lazyload/dist/vue-lazyload.umd.js](https://unpkg.com/@jambonn/vue-lazyload/dist/vue-lazyload.umd.js)

```html
<script src="https://unpkg.com/@jambonn/vue-lazyload/dist/vue-lazyload.umd.js"></script>
<script>
  var AttributeBindingApp = {
    data() {
      return {
        message: 'Vue Lazyload'
      }
    }
  }
  var app = Vue.createApp(AttributeBindingApp)
  app.use(window['vue-lazyload'].default)
  app.mount('#bind-attribute')
  ...
</script>

```

# Usage

main.js:

```javascript

import { createApp } from 'vue'
import VueLazyload from '@jambonn/vue-lazyload'
import App from './App.vue'

const app = createApp(App)
app.use(VueLazyload)

// or with options
const loadimage = require('./assets/loading.gif')
const errorimage = require('./assets/error.gif')
app.use(VueLazyload, {
  preLoad: 1.3,
  error: errorimage,
  loading: loadimage,
  attempt: 1
})

app.mount('#app')
```

template:

```html
<ul>
  <li v-for="img in list">
    <img v-lazy="img.src" >
  </li>
</ul>
```

use `v-lazy-container` work with raw HTML

```html
<div v-lazy-container="{ selector: 'img' }">
  <img data-src="//domain.com/img1.jpg">
  <img data-src="//domain.com/img2.jpg">
  <img data-src="//domain.com/img3.jpg">  
</div>
```

custom `error` and `loading` placeholder image

```html
<div v-lazy-container="{ selector: 'img', error: 'xxx.jpg', loading: 'xxx.jpg' }">
  <img data-src="//domain.com/img1.jpg">
  <img data-src="//domain.com/img2.jpg">
  <img data-src="//domain.com/img3.jpg">  
</div>
```

```html
<div v-lazy-container="{ selector: 'img' }">
  <img data-src="//domain.com/img1.jpg" data-error="xxx.jpg">
  <img data-src="//domain.com/img2.jpg" data-loading="xxx.jpg">
  <img data-src="//domain.com/img3.jpg">  
</div>
```

## Constructor Options

|key|description|default|options|
|:---|---|---|---|
| `preLoad`|proportion of pre-loading height|`1.3`|`Number`|
|`error`|src of the image upon load fail|`'data-src'`|`String`
|`loading`|src of the image while loading|`'data-src'`|`String`|
|`attempt`|attempts count|`3`|`Number`|
|`listenEvents`|events that you want vue listen for|`['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']`| [Desired Listen Events](#desired-listen-events) |
|`adapter`| dynamically modify the attribute of element |`{ }`| [Element Adapter](#element-adapter) |
|`filter`| the image's listener filter |`{ }`| [Image listener filter](#image-listener-filter) |
|`lazyComponent`| lazyload component | `false` | [Lazy Component](#lazy-component)
| `dispatchEvent`|trigger the dom event|`false`|`Boolean`|
| `throttleWait`|throttle wait|`200`|`Number`|
| `observer`|use IntersectionObserver|`false`|`Boolean`|
| `observerOptions`|IntersectionObserver options|{ rootMargin: '0px', threshold: 0.1 }|[IntersectionObserver](#intersectionobserver)|
| `silent`|do not print debug info|`true`|`Boolean`|

### Desired Listen Events

You can configure which events you want vue-lazyload by passing in an array
of listener names.

```javascript
const app = createApp(AttributeBindingApp)
app.use(VueLazyload, {
  preLoad: 1.3,
  error: 'dist/error.png',
  loading: 'dist/loading.gif',
  attempt: 1,
  // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
  listenEvents: [ 'scroll' ]
})
```

This is useful if you are having trouble with this plugin resetting itself to loading
when you have certain animations and transitions taking place

### Image listener filter

dynamically modify the src of image

```javascript
const app = createApp(AttributeBindingApp)
app.use(VueLazyload, {
    filter: {
      progressive (listener, options) {
          const isCDN = /qiniudn.com/
          if (isCDN.test(listener.src)) {
              listener.el.setAttribute('lazy-progressive', 'true')
              listener.loading = listener.src + '?imageView2/1/w/10/h/10'
          }
      },
      webp (listener, options) {
          if (!options.supportWebp) return
          const isCDN = /qiniudn.com/
          if (isCDN.test(listener.src)) {
              listener.src += '?imageView2/2/format/webp'
          }
      }
    }
})
```

### Element Adapter

```javascript
const app = createApp(AttributeBindingApp)
app.use(VueLazyload, {
    adapter: {
        loaded ({ bindType, el, naturalHeight, naturalWidth, $parent, src, loading, error, Init }) {
            // do something here
            // example for call LoadedHandler
            LoadedHandler(el)
        },
        loading (listender, Init) {
            console.log('loading')
        },
        error (listender, Init) {
            console.log('error')
        }
    }
})
```

### IntersectionObserver

use [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to to improve performance of a large number of nodes.

```javascript
const app = createApp(AttributeBindingApp)
app.use(vueLazy, {
  // set observer to true
  observer: true,

  // optional
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1
  }
})
```

### Lazy Component
```javascript
const app = createApp(AttributeBindingApp)
app.use(VueLazyload, {
  lazyComponent: true
});
```

```html
<lazy-component @show="handler">
  <img class="mini-cover" :src="img.src" width="100%" height="400">
</lazy-component>

<script>
  export default {
    setup () {
      const handler = () => {
        console.log('this component is showing')
      }
      return { handler }
    }
  }
</script>
```
Use in list
```html
<lazy-component v-for="(item, index) in list" :key="item.src" >
  <img class="mini-cover" :src="item.src" width="100%" height="400">
</lazy-component>
```


## Implementation

### Basic

vue-lazyload will set this img element's `src` with `imgUrl` string

```html
<template>
  <div">
     <img v-lazy="imgUrl"/>
     <div v-lazy:background-image="imgUrl"></div>

     <!-- with customer error and loading -->
     <img v-lazy="imgObj"/>
     <div v-lazy:background-image="imgObj"></div>

     <!-- Customer scrollable element -->
     <img v-lazy.container ="imgUrl"/>
     <div v-lazy:background-image.container="img"></div>

    <!-- srcset -->
    <img v-lazy="'img.400px.jpg'" data-srcset="img.400px.jpg 400w, img.800px.jpg 800w, img.1200px.jpg 1200w">
    <img v-lazy="imgUrl" :data-srcset="imgUrl' + '?size=400 400w, ' + imgUrl + ' ?size=800 800w, ' + imgUrl +'/1200.jpg 1200w'" />
  </div>
</template>

<script>
  import { ref, reactive } from 'vue'
  export default {
    setup () {
      const imgObj = reactive({
        src: 'http://xx.com/logo.png',
        error: 'http://xx.com/error.png',
        loading: 'http://xx.com/loading-spin.svg'
      })
      const imgUrl = ref('http://xx.com/logo.png') // String

      return { imgObj, imgUrl }
    }
  }
</script>
```

### CSS state

There are three states while img loading

`loading`  `loaded`  `error`

```html
<img src="imgUrl" lazy="loading">
<img src="imgUrl" lazy="loaded">
<img src="imgUrl" lazy="error">
```

```html
<style>
  img[lazy=loading] {
    /*your style here*/
  }
  img[lazy=error] {
    /*your style here*/
  }
  img[lazy=loaded] {
    /*your style here*/
  }
  /*
  or background-image
  */
  .yourclass[lazy=loading] {
    /*your style here*/
  }
  .yourclass[lazy=error] {
    /*your style here*/
  }
  .yourclass[lazy=loaded] {
    /*your style here*/
  }
</style>
```



## Methods

### Event Hook
```javascript
import { getCurrentInstance, inject } from 'vue'
export default {
  setup() {
    const internalInstance = getCurrentInstance().appContext.config.globalProperties
    const LazyLoad = internalInstance.$Lazyload
    // or
    const Lazyload = inject('Lazyload')

    Lazyload.$on(event, callback)
    Lazyload.$off(event, callback)
    Lazyload.$once(event, callback)
  }
}
```
- `$on` Listen for a custom events `loading`, `loaded`, `error`
- `$once` Listen for a custom event, but only once. The listener will be removed once it triggers for the first time.
- `$off` Remove event listener(s).

#### `Lazyload.$on`

#### Arguments:

* `{string} event`
* `{Function} callback`

#### Example

```javascript
Lazyload.$on('loaded', function ({ bindType, el, naturalHeight, naturalWidth, $parent, src, loading, error }, formCache) {
  console.log(el, src)
})
```

#### `Lazyload.$once`

#### Arguments:

* `{string} event`
* `{Function} callback`

#### Example

```javascript
Lazyload.$once('loaded', function ({ el, src }) {
  console.log(el, src)
})
```

#### `Lazyload.$off`

If only the event is provided, remove all listeners for that event

#### Arguments:

* `{string} event`
* `{Function} callback`

#### Example

```javascript
import { getCurrentInstance, inject } from 'vue'
export default {
  setup() {
    const internalInstance = getCurrentInstance().appContext.config.globalProperties
    const LazyLoad = internalInstance.$Lazyload
    // or
    const Lazyload = inject('Lazyload')

    const handler = ({ el, src }, formCache) => {
      console.log(el, src)
    }
    Lazyload.$on('loaded', handler)
    Lazyload.$off('loaded', handler)
    Lazyload.$off('loaded')
  }
}
```

### LazyLoadHandler

`Lazyload.lazyLoadHandler`

Manually trigger lazy loading position calculation

#### Example

```javascript
import { getCurrentInstance, inject } from 'vue'
export default {
  setup() {
    const internalInstance = getCurrentInstance().appContext.config.globalProperties
    const LazyLoad = internalInstance.$Lazyload
    // or
    const Lazyload = inject('Lazyload')

    Lazyload.lazyLoadHandler()
  }
}
```

### Performance

```javascript
import { getCurrentInstance, inject } from 'vue'
export default {
  setup() {
    const internalInstance = getCurrentInstance().appContext.config.globalProperties
    const LazyLoad = internalInstance.$Lazyload
    // or
    const Lazyload = inject('Lazyload')

    Lazyload.$on('loaded', function (listener) {
      console.table(Lazyload.performance())
    })
  }
}
```

![performance-demo](http://ww1.sinaimg.cn/large/69402bf8gw1fbo62ocvlaj213k09w78w.jpg)

### Dynamic switching pictures

```vue
 <img v-lazy="lazyImg" :key="lazyImg.src">
```

# Authors && Contributors

- [hilongjw](https://github.com/hilongjw)
- [imcvampire](https://github.com/imcvampire)
- [darrynten](https://github.com/darrynten)
- [biluochun](https://github.com/biluochun)
- [whwnow](https://github.com/whwnow)
- [Leopoldthecoder](https://github.com/Leopoldthecoder)
- [michalbcz](https://github.com/michalbcz)
- [blue0728](https://github.com/blue0728)
- [JounQin](https://github.com/JounQin)
- [llissery](https://github.com/llissery)
- [mega667](https://github.com/mega667)
- [RobinCK](https://github.com/RobinCK)
- [GallenHu](https://github.com/GallenHu)
- [Jambon](https://github.com/jambonn)

# License

[The MIT License](http://opensource.org/licenses/MIT)
