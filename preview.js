// form preview javascript
console.log('hello from preview.js!')

;(() => {
  const styles = [
    'https://formio-sfds.herokuapp.com/sfgov/forms.css'
  ]
  const scripts = [
    'https://unpkg.com/formiojs@4.13.1/dist/formio.full.min.js',
    'https://unpkg.com/formio-sfds@9.2.2/dist/formio-sfds.standalone.js'
  ]

  const observer = new MutationObserver(mutations => {
    const el = mutations
      .map(({ target }) => nearest(target, '.formio-form'))
      .find(Boolean) // return the first one

    const attr = 'data-hijacked'
    if (el && !el.hasAttribute(attr)) {
      el.setAttribute(attr, true)
      const url = Object.values(window.Formio.forms).pop().url
      const preview = renderPreview(url)
      el.hidden = true
      el.parentNode.insertBefore(preview, el)
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })

  function renderPreview (url) {
    const iframe = document.createElement('iframe')
    iframe.style.width = '100%'
    iframe.style.height = '800px'
    iframe.srcdoc = `
      <style type="text/css">
        ${styles.map(url => `@import url('${url}');`).join('\n')}
      </style>
      <div id="formio"></div>
      ${scripts.map(src => `<script src="${src}"></script>`).join('\n')}
      <script>
        Formio.createForm(document.getElementById('formio'), ${JSON.stringify(url)})
          .then(form => alert('form created!'))
      </script>
    `
    return iframe
  }

  function nearest (el, selector) {
    return el.matches(selector) ? el : el.querySelector(selector)
  }
})()
