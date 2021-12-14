// form preview javascript
(() => {
  console.log('[sfds] preview')
  
  const observer = new MutationObserver(mutations => {
    const el = mutations
      .map(({ target }) => nearest(target, '.formio-form'))
      .find(Boolean) // return the first one

    const attr = 'data-hijacked'
    if (el && !el.hasAttribute(attr)) {
      el.setAttribute(attr, true)
      const form = Object.values(window.Formio.forms).pop()
      console.log('[sfds] form:', form)
      const [projectId, formName] = form.machineName.split(':')
      const { host } = new URL(form.url)
      const url = `${host}/${projectId}/${formName}`
      console.log('[sfds] rendering preview for: %s', url)
      const preview = renderPreview(url)
      el.hidden = true
      el.parentNode.insertBefore(preview, el)
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
          .then(form => alert('[sfds] form ready!'))
      </script>
    `
    return iframe
  }

  function nearest (el, selector) {
    return el.matches(selector) ? el : el.querySelector(selector)
  }
})()
