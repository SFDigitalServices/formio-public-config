// form preview javascript
(() => {
  console.log('[sfds] preview')

  loadStylesheet('https://unpkg.com/sfgov-design-system@2.2.0/dist/css/fonts.css')
  loadStylesheet('https://unpkg.com/sfgov-design-system@2.2.0/dist/css/sfds.css')

  document.body.classList.add('font-rubik')
  const header = document.querySelector('header')
  header?.classList.add('py-28', 'mb-96')
  
  const observer = observe({
    '.formio-form': hijackForm,
    'a[routerlink=view]': el => {
      el.lastChild.nodeValue = 'Preview'
    },
    '.navbar-brand': el => {
      el.classList.replace('navbar-brand', 'text-big-desc')
      el.classList.add('text-inherit')
    },
    'app-form h2': el => {
      el.classList.remove('mb-3')
      el.classList.add('text-display-lg', 'mb-40')
    },
    'app-form .nav-link[routerlink="../"]': el => {
      if (el.hidden) return
      const link = el.cloneNode(false)
      link.classList.remove('nav-link')
      link.classList.add('block', 'mb-8')
      link.textContent = 'Back to all forms'
      const title = document.querySelector('h2.text-display-lg')
      title?.parentNode.insertBefore(link, title)
      el.hidden = true
    },
    'app-form .nav-link[routerlink=edit]:not([data-moved])': a => {
      const li = a.parentNode
      li.parentNode.insertBefore(li, li.parentNode.firstChild)
      a.setAttribute('data-moved', true)
    },
    // change "Edit Data" button text to "Preview"
    '.form-btn.form-btn-use': el => {
      el.textContent = 'Preview'
    },
    // Updates the "All forms" table button style
    'tbody button': el => {
      el.classList.remove('btn-outline-secondary', 'btn-sm', 'form-btn')
      el.classList.add('bg-none', 'border-slate-3', 'border-2', 'text-slate-3', 'rounded-4', 'my-2')
    },
    '.fa-trash': el => {
      el.parentNode.appendChild(document.createTextNode('Delete'))
      el.classList.remove('fa-trash')
    },
    '.fa': el => {
      el.classList.remove('fa')
      el.remove()
    },
    '.nav.mb-2': el => el.classList.replace('mb-2', 'mb-20'),
    '.builder-group-button': el => {
      el.classList.remove('builder-group-button')
      el.classList.add('bg-grey-2', 'text-black')
    }
  })

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
    const entries = Object.entries(selectors)
    for (const [selector, fn] of entries) {
      for (const el of document.querySelectorAll(selector)) {
        fn(el)
      }
    }
    return new MutationObserver(mutations => {
      for (const [selector, fn] of entries) {
        for (const mute of mutations) {
          const el = nearest(mute.target, selector)
          if (el) {
            fn(el)
          }
        }
      }
    })
  }
})()
