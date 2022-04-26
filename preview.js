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
        el.classList.add('text-display-lg', 'mb-80')
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
      // --- start LOGIN PAGE---
      // Removes login accordion style
      '.card.card-primary.panel.panel-default': el => {
       el.classList.add('border-0')
      },
      '.card-header.panel-heading': el => {
       el.classList.add('border-0','bg-none')
      }, 
      // Disables the login button nav item       
      'a[routerlink=login]': el => {
       el.classList.remove('rounded-0', 'border-t-0', 'border-l-0', 'border-r-0', 'bg-slate-1', 'text-body', 'text-slate-3', 'font-medium', 'border-slate-2', 'border-b-4')
        el.classList.add('border-0', 'p-0', 'text-title-xl-desktop', 'text-black')
      },       
      // --- end LOGIN PAGE---

      // --- start SITE VIEW---
      // Standardizes form buttons style
      '.form-control': el => {
       el.classList.add('h-44', 'bg-slate-1', 'rounded-lg', 'border-0')
      },
      // Standardizes choice input style
      '.formio-component-multiple .choices__input': el => {
        el.classList.add('bg-slate-1')
      },
      // --- end SITE VIEW---

      // --- start ALL FORMS VIEW---
      // Adds spacing above the table
      '.input-group': el => {
       el.classList.add('mb-5')
      },
      // Updates the form header style
      'th': el => {
       el.classList.add('bg-slate-3', 'text-small', 'text-white', 'border-b-0', 'px-16', 'py-8')
      },
      // Narrows the form title container width
      'td .row .col-sm-8': el => {
      el.classList.remove('col-sm-8')
        el.classList.add('col-sm-6')
      },
      // Widens the button div and adds some formatting
      'td .row .col-sm-4': el => {
      el.classList.remove('col-sm-4')
        el.classList.add('col-sm-6', 'flex', 'justify-end')
      },
      // Changes "Edit Data" button text to "Preview"
      '.form-btn.form-btn-use': el => {
        el.textContent = 'Preview'
      },
      // Updates table style of "All forms"
      'table': el => {
        el.classList.remove('table-striped', 'table-bordered', 'table-hover')
      },
      // Updates table button style of "All forms"
      'tbody button': el => {
        el.classList.remove('btn-outline-secondary', 'btn-sm', 'form-btn')
        el.classList.add('bg-none', 'border-slate-3', 'border-2', 'text-slate-3', 'rounded-4', 'my-2', 'mx-4', 'hocus:bg-slate-4', 'hocus:text-white')
      },
      // Updates table spacing of "All forms"
      '.table td': el => {
        el.classList.add('p-16')
      }, 
      // Updates table title style of "All forms"
      '.table h5': el => {
          el.classList.add('title-xs', 'hocus:title-xs', 'hocus:text-blue-dark')
      }, 
      // Updates form item counter style 
      '.item-counter': el => {
        el.classList.add('text-slate-2')
      },     
      '.page-num': el => {
        el.classList.add('text-slate-2','text-body','font-medium')
      },
      // Adds pagination margin 
      'ul.pagination.justify-content-center.pagination-sm': el => {
        el.classList.add('mt-80')
      },  
      // Updates pagination active style
      'li.pagination-page.page-item.active .page-link': el => {
        el.classList.add('text-slate-4', 'text-body', 'font-medium', 'border-0', 'bg-none', 'my-4', 'mx-20')
      },  
      // Updates pagination prev disabled style
      'li.pagination-prev.page-item.disabled .page-link': el => {
        el.classList.add('text-action', 'text-body', 'font-medium', 'border-3', 'border-action', 'rounded-lg', 'px-3')
      },     
      // Updates pagination next disabled style
      'li.pagination-next.page-item.disabled .page-link': el => {
        el.classList.add('text-action', 'text-body', 'font-medium', 'border-3', 'border-action', 'rounded-lg', 'px-3')
      },                 
      // --- end ALL FORMS VIEW---

      // --- start EDIT FORM VIEW---      
      // Updates nav tabs style
      '.nav-tabs': el => {
        el.classList.add('mb-40', 'border-0')
      }, 
      // Updates nav link style
      '.nav-link': el => {
        el.classList.add('rounded-0', 'bg-none', 'border-grey-3', 'border-b-2', 'border-t-0', 'border-l-0', 'border-r-0')
      },                
      // Updates nav active link style
      '.nav-link.active': el => {
        el.classList.remove('bg-none', 'border-grey-3', 'border-b-2')
        el.classList.add('bg-slate-1', 'text-body', 'text-slate-3', 'font-medium', 'border-slate-2', 'border-b-4')
      }, 
      // Updates nav *inactive* link style
      '.nav-link:not(.active)': el => {
        el.classList.remove('bg-slate-1', 'border-slate-2', 'border-b-4')
        el.classList.add('bg-none', 'text-body', 'text-slate-3', 'font-medium', 'border-grey-3', 'border-b-2')
      }, 
      // Increases form group margin bottom  
      '.form-group': el => {
        el.classList.add('mb-40')
      }, 
      // Increases sidebar spacing
      '.card.form-builder-panel': el => {
        el.classList.add('mb-8')
      },
      // Updates sidebar folder style
      '.card-header.form-builder-group-header': el => {
        el.classList.add('border-0')
      },      
      // Updates sidebar button style
      '.formcomponent.drag-copy': el => {
        el.classList.add('bg-slate-3', 'text-white', 'items-baseline','justify-start')
      },
      // Updates form area layout
      '.formarea': el => {
        el.classList.add('flex')
      }, 
      // Updates builder component drag container style
      '[ref="-container"]': el => {
        el.classList.add('bg-grey-1', 'py-16', 'pl-16')
      },        
      // Updates page breadcrumb background style
      '.breadcrumb': el => {
        el.classList.add('flex-col','order-2', 'w-1/3', 'rounded-0', 'p-28', 'bg-grey-1')
      }, 
      // Updates active page breadcrumb style
      '.badge-primary': el => {
        el.classList.remove('mr-2')  
        el.classList.add('bg-none', 'text-small', 'text-slate-4', 'font-medium', 'p-0', 'mb-8')
      },   
      // Updates inactive page breadcrumb style
      '.badge-info': el => {
        el.classList.remove('mr-2')  
        el.classList.add('bg-none', 'text-small', 'text-action', 'font-regular', 'underline', 'p-0', 'mb-8')
      },
      // Updates add page breadcrumb style
      '[ref="addPage"]': el => {
        el.classList.remove('mr-2')
        el.classList.add('bg-slate-3', 'text-small', 'text-white', 'font-semibold', 'rounded-sm', 'block', 'mt-16', 'm-0', 'p-8')
        const icon = el.querySelector('i')
        if (icon) {
          icon.classList.add('mr-4')
          icon.nextSibling.textContent = 'Add new page'
        } 
      },  
      // Updates editor area card style
      '.builder-component .card': el => {
        el.classList.remove('border')
        el.classList.add('border-0')
      },  
      // Updates editor area card header style
      '.builder-component .card-header': el => {
        el.classList.remove('bg-default')  
        el.classList.add('bg-white', 'border-dashed','border-grey-4', 'border-1','rounded-0','border-0')
      },     
      // Updates editor area component border style
      '.formbuilder .formio-component-content': el => {
       el.classList.add('border-dashed','border-grey-4', 'border-1')
      },        
      // Enlarges editor area page title
      '.card-title': el => {
        el.classList.add('text-title-xl', 'text-slate-4')
      }, 
      // ---end EDIT FORM VIEW---

      // Replaces trash icons with the text "Delete"
      '.fa-trash': el => {
        el.parentNode.appendChild(document.createTextNode('Delete'))
        el.classList.remove('fa-trash')
      },
      // Removes FontAwesome (.fa) icons in specific places
      'table .fa, .nav-link .fa, .fa-share-alt': el => {
        el.classList.remove('fa')
        el.remove()
      },
      '.nav.mb-2': el => el.classList.replace('mb-2', 'mb-20'),
      '.builder-group-button': el => {
        el.classList.remove('builder-group-button')
        el.classList.add('bg-grey-2', 'text-black', 'text-left', 'p-8')
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
      return el.matches(selector) ? [el] : el.querySelectorAll(selector)
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
            const els = nearest(mute.target, selector)
            for (const el of els) {
              fn(el)
            }
          }
        }
      })
    }
  })()
