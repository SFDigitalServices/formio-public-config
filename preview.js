// form preview javascript
(() => {
  console.log('[sfds] preview')

  loadStylesheet('https://unpkg.com/sfgov-design-system@2.2.0/dist/css/utilities.css')
  loadStylesheet('https://unpkg.com/sfgov-design-system@2.2.0/dist/css/fonts.css')

  document.body.classList.add('font-rubik')
  document.querySelector('header').classList.add('py-28')
  const title = document.querySelector('.navbar-brand')
  title.classList.replace('navbar-brand', 'text-big-desc')
  title.classList.add('text-inherit')
  
  const observer = new MutationObserver(observe({
    '.formio-form': hijackForm,
    'a[routerlink=view]': el => {
      el.lastChild.nodeValue = 'Preview'
    }
  }))

  observer.observe(document.body, { childList: true, subtree: true })

  function renderPreview (url) {
    const styles = [
      'https://formio-sfds.herokuapp.com/sfgov/forms.css'
    ]
    const scripts = [
      'https://unpkg.com/formiojs@4.13.1/dist/formio.full.min.js',
      'https://unpkg.com/formio-sfds@9.2.2/dist/formio-sfds.standalone.js'
    ]

    const iframe = document.createElement('iframe')
    setStyle(iframe, {
      border: 'none',
      width: '100%',
      height: '750px',
      'overflow-y': 'auto',
      'margin-top': '96px'
    })
    iframe.srcdoc = `
      <style type="text/css">
        ${styles.map(url => `@import url('${url}');`).join('\n')}
      </style>
      <div id="formio"></div>
      ${scripts.map(src => `<script src="${src}"></script>`).join('\n')}
      <script>
        Formio.createForm(document.getElementById('formio'), ${JSON.stringify(url)})
          .then(form => console.info('[sfds] form ready!'))
      </script>
    `
    return iframe
  }

  function setStyle (el, styles) {
    for (const [prop, value] of Object.entries(styles)) {
      el.style.setProperty(prop, value)
    }
  }
  
  function nearest (el, selector) {
    return el.matches(selector) ? el : el.querySelector(selector)
  }

  function loadStylesheet (url) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    return document.head.appendChild(link)
  }

  function hijackForm (el) {
    if (!el.closest('app-view')) {
      console.warn('[sfds] skipping hijack (not contained in <app-view>):', el)
      return
    }

    const attr = 'data-hijacked'
    if (el && !el.hasAttribute(attr)) {
      el.setAttribute(attr, true)
      const form = Object.values(window.Formio.forms).pop()
      console.log('[sfds] form:', form)
      const url = `${form.formio.projectUrl}/${form.form.path}`
      console.log('[sfds] rendering preview for: %s', url)
      const preview = renderPreview(url)
      el.hidden = true
      el.parentNode.insertBefore(preview, el)
    }
  }

  function observe (selectors) {
    return mutations => {
      for (const [selector, fn] of Object.entries(selectors)) {
        for (const mute of mutations) {
          const el = nearest(mute.target, selector)
          if (el) {
            fn(el)
          }
        }
      }
    }
  }
})()
