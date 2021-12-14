// form preview javascript
console.log('hello from preview.js!')
(() => {
  
  const observer = new MutationObserver(mutations => {
    const selector = '.formio-form'
    const el = mutations
      .map(mute => mute.target.matches(selector) ? mute.target : mute.target.querySelector(selector))
      .find(Boolean)
    if (el && !el.hasAttribute('data-hijacked')) {
      el.setAttribute('data-hijacked', true)
      const url = Object.values(Formio.forms).pop().url
      console.log('[sfds] hijacked:', el, url)
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
  
})()
