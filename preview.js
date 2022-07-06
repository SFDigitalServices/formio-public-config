// form preview javascript
(() => {
    console.log('[sfds] preview')
  
    const designSystemVersion = '0.0.0-259b525'
    loadStylesheet(`https://unpkg.com/sfgov-design-system@${designSystemVersion}/dist/css/fonts.css`)
    loadStylesheet(`https://unpkg.com/sfgov-design-system@${designSystemVersion}/dist/css/sfds.css`)
  
    document.body.classList.add('font-rubik')
    const heading = document.querySelector('header')
    heading?.classList.add('py-28', 'mb-96')
  
    const navLinkClasses = [
      'text-body', 'text-slate-3', 'font-medium',
      'rounded-0', 'bg-none', 'border-grey-3', 'border-b-2', 'border-t-0', 'border-l-0', 'border-r-0'
    ]
    const navLinkActiveClasses = ['bg-slate-1', 'border-slate-2', 'border-b-4']
    const navLinkInactiveClasses = ['bg-none', 'border-grey-3', 'border-b-2']
  
    const observer = observe({
      '.formio-form': hijackForm,
      'a[routerlink=view]': el => {
        el.lastChild.nodeValue = 'Preview'
      },
      '.container-demo': el => {
        const login = el.querySelector('app-auth')
        classify(el, login, ['w-auto', 'lg:w-2/3', 'xl:w-1/3'])
        // add the "All forms" heading if the "grid" is visible
        if (el.querySelector('formio-grid')) {
          if (!el.querySelector('[data-role=heading-all-forms]')) {
            const title = document.createElement('h1')
            title.classList.add('text-title-xl-desktop', 'font-medium', 'text-slate-4', 'mb-80')
            title.setAttribute('data-role', 'heading-all-forms')
            title.textContent = 'All forms'
            el.insertBefore(title, el.firstChild)
          }
        } else {
          el.querySelector('[data-role=heading-all-forms]')?.remove()
        }
      },
      '.navbar-brand': el => {
        el.classList.replace('navbar-brand', 'big-desc')
        el.classList.add('text-inherit')
      },
      'app-form h2': el => {
        el.classList.remove('mb-3')
        el.classList.add('text-title-xl-desktop', 'font-medium', 'text-slate-4', 'mb-80')
        el.setAttribute('data-role', 'form-heading')
      },
      'app-form .nav-link[routerlink="../"]': el => {
        if (el.hidden) return
        const link = el.cloneNode(false)
        link.classList.remove('nav-link')
        link.classList.add('block', 'mb-8')
        link.textContent = 'Back to all forms'
        const title = document.querySelector('[data-role=form-heading]')
        if (!title) console.warn('no [data-role=form-heading]!')
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
        el.classList.add('border-0', 'bg-none')
      }, 
      // Disables the login button nav item       
      'a[routerlink=login]': el => {
        // no pointer cursor
        el.style.cursor = 'default'
        el.classList.add('border-0', 'p-0', 'display-lg', 'text-black')
      },       
      // --- end LOGIN PAGE---
  
      // --- start SITE VIEW---
      // Standardizes form buttons style
      '.form-control': el => {
       el.classList.add('bg-slate-1', 'rounded-lg', 'border-0', 'text-black', 'text-body', 'shadow-none')
      },
      // Standardizes choice input style
      '.formio-component-multiple .choices__input': el => {
       el.classList.add('bg-slate-1')
      }, 
      /*
      // Updates the login authentication style        
      'a[routerlink=auth]': el => {
       el.classList.add('text-action')
      },
      */
      // --- end SITE VIEW---
      
      // --- start EDIT FORM VIEW---
      // Increases margin bottom to form group row
      '.form-group.row': el => {
        el.classList.add('mb-40')
      },         
      // Updates Edit button style 
      '[ref="editComponent"]': el => {
        el.classList.remove('btn-secondary')
        el.classList.add('btn-primary')
      },  
      // Updates Move, Edit JSON, Copy, Paste buttons style 
      '[ref="moveComponent"], [ref="editJson"], [ref="pasteComponent"], [ref="copyComponent"]': el => {
        el.classList.remove('btn-default')
        el.classList.add('btn-secondary', 'border-1')
      },    
      '.btn-danger, [ref="removeComponent"]': el => {
        if (el.getAttribute('title') !== 'Delete form') {
          el.classList.add('bg-red-3')
        }
      },
      // --- end EDIT FORM VIEW---

      // --- start SHARE/EMBED dialog
      '[role=dialog] .nav-item:not([hidden])': el => {
        if (el.textContent.trim() === 'Embed') {
          el.hidden = true
        }
      },
      '[role=dialog] input[placeholder="https://examples.form.io/example"]': el => {
        if (!el.hasAttribute('data-original-value')) {
          el.setAttribute('data-original-value', el.value)
        }
        el.value = el.value.replace('/manage/view/#/form', '')
      },
      '.btn-light': el => {
        el.classList.remove('btn-light')
        el.classList.add('hocus:text-white')
      },
      // --- end share/embed dialog
      
      // --- start ACTIONS VIEW ---
      '[id="action-select"]': el => {
        el.classList.add('mr-20')
      },
          
      // --- end ACTIONS VIEW ----

      // --- start ALL FORMS VIEW---
      // Adds spacing above the table
      '.input-group': el => {
       el.classList.add('mb-28')
      },
      // Updates the form header style
      'th': el => {
       el.classList.add('bg-slate-3', 'small', 'text-white', 'border-b-0', 'px-16', 'py-8')
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
      
      // Updates pagination inactive style
      'li.pagination-page.page-item .page-link': el => {
        el.classList.add('text-action', 'text-body', 'font-medium', 'underline', 'border-0', 'bg-none', 'my-4', 'mx-8')
      },  
      // Updates pagination active style
      'li.pagination-page.page-item.active .page-link': el => {
        el.classList.add('text-slate-4', 'no-underline')
      },  
      // Hide pagination disabled style
      'ul.pagination li.page-item.disabled': el => {
        el.classList.add('hidden')
      },
        // ------ NOT Hide pagination disabled style-----
      'ul.pagination li.page-item:not(.disabled)': el => {
        el.classList.remove('hidden')
      },  
      // Updates pagination prev and next style
      'li.pagination-prev .page-link, li.pagination-next .page-link': el => {
        el.classList.add('text-action', 'text-body', 'font-medium', 'border-3', 'border-action', 'rounded-lg', 'px-3', 'hocus:bg-blue-dark', 'hocus:text-white', 'hocus:border-blue-dark')
      },
      // Updates pagination prev style
      'li.pagination-prev .page-link': el => {
        el.classList.add('mr-16')
      },   
      // Updates pagination next style
      'li.pagination-next .page-link': el => {
        el.classList.add('ml-16')
      },
      
      // "Share" button --> "Embed" nav link
      '.pull-right.btn': el => {
        if (moveElement(el, 'app-form', 'app-form > ul.nav-tabs', 'li:nth-child(4)')) {
          el.textContent = 'Embed'
          el.className = ['nav-link', ...navLinkClasses, ...navLinkInactiveClasses].join(' ')
          const li = document.querySelector('app-form > .nav-tabs li').cloneNode()
          el.parentNode.insertBefore(li, el)
          li.appendChild(el)
        }
      },
      
      // --- end ALL FORMS VIEW---
  
      // --- start EDIT FORM VIEW---      
      // Updates nav tabs style
      '.nav-tabs': el => {
        el.classList.add('border-0')
      },
      
      // Updates nav link style
      '.nav-link:not([routerlink=login])': el => {
        // all nav links get these classes
        el.classList.add(...navLinkClasses)
        classify(el, el.matches('.active'), navLinkActiveClasses, navLinkInactiveClasses)
      },                
  
      // Updates sidebar folder style
      '.card.form-builder-panel': el => {
        el.classList.add('border-2', 'border-grey-2', 'mb-8')
      },
      '.card-header': el => {
        el.classList.add('bg-white', 'border-0', 'm-8')
      },
      // Updates sidebar folder header style
      '.card-header.form-builder-group-header': el => {
        el.classList.add('border-0')
      },   
      // Updates sidebar folder show style 
      '[ref="sidebar-container"]': el => {
        el.classList.add('p-8')
      },        
      // Updates sidebar button style
      '.formcomponent.drag-copy': el => {
        el.classList.add('bg-slate-3', 'text-white', 'items-baseline', 'justify-start', 'mt-4')
      },
      // Updates form area layout
      '.formarea': el => {
        el.classList.add('flex', 'mb-20')
      }, 
      // Updates builder component drag container style
      '[ref="-container"]': el => {
        el.classList.add('bg-grey-1', 'py-16', 'pl-16')
      },        
      // Updates page breadcrumb background style
      '.breadcrumb': el => {
        el.classList.add('flex-col', 'order-2', 'w-1\/4', 'bg-grey-1', 'inline', 'rounded-0', 'p-28', 'm-0')
      },   
      // Updates inactive page breadcrumb style
      '.wizard-page-label': el => {
        el.classList.remove('mr-2', 'badge', 'badge-info')  
        el.classList.add('block', 'bg-none', 'small', 'text-action', 'font-normal', 'underline', 'p-0', 'mb-20', 'leading-snug')
      },
      // Updates active page breadcrumb style
      'span.badge-primary.wizard-page-label': el => {
        el.classList.remove('mr-2', 'badge', 'badge-info', 'text-action', 'font-normal', 'underline')  
        el.classList.add('text-slate-4', 'font-medium', 'no-underline')
      },         
      // Updates add page breadcrumb style
      'span.badge-success.wizard-page-label': el => {
        el.classList.remove('mr-2', 'text-action', 'p-0', 'underline')
        el.classList.add('bg-slate-3', 'small', 'text-white', 'font-medium', 'rounded-sm', 'block', 'mt-16', 'm-0', 'p-8', 'text-center')
        const icon = el.querySelector('i')
        if (icon) {
          icon.classList.add('mr-8')
          icon.nextSibling.textContent = 'Add new page'
        } 
      },
        
      // Adds a background grey to the editor
        '[ref="form"]': el => {
        el.classList.add('bg-grey-1', 'w-3\/4')
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
      '[ref="dragComponent"] .card-title': el => {
        el.classList.add('text-display-lg', 'text-slate-4')
      }, 
      // ---end EDIT FORM VIEW---
        
      // ---start VIEW DATA VIEW--- 
      // Extend table width for header and data
      'div.k-grid th, div.k-grid td': el => {
        el.classList.add('w-sm')
      },  
      // Align table header icon 
      'div.k-grid-header .k-header-column-menu': el => {
        el.classList.add('items-end')
      },  
      // ---end VIEW DATA VIEW---  
  
      // Replaces trash (and "times circle o") icons with the text "Delete"
      '.fa-trash, .fa-times-circle-o': el => {
        el.parentNode.appendChild(document.createTextNode('Delete'))
        el.classList.remove('fa-trash')
      },
      // Removes FontAwesome (.fa) icons in specific places
      'table .fa, .nav-link .fa, .fa-share-alt': el => {
        el.classList.remove('fa')
        el.remove()
      },
      // Add style to FontAwesome (.fa) icons 
      '.builder-sidebar i.fa': el => {
        el.classList.add('mr-8')
      },  
      // Updates sidebar folder buttons style      
      '.nav.mb-2': el => el.classList.replace('mb-2', 'mb-20'),
      '.builder-group-button': el => {
        el.classList.remove('builder-group-button')
        el.classList.add('bg-grey-2', 'text-black', 'text-left', 'p-8', 'block', 'rounded-0')
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
        height: '1200px',
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
        console.debug('[sfds] skipping hijack (not contained in <app-view>):', el)
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
    
    function classify (el, condition, passClasses, failClasses = []) {
      if (condition) {
        el.classList.add(...passClasses)
        el.classList.remove(...failClasses)
      } else {
        el.classList.remove(...passClasses)
        el.classList.add(...failClasses)
      }
    }
    
    function moveElement (el, fromSelector, toSelector, beforeSelector, wrap) {
      if (el.closest(fromSelector)) {
        const newParent = document.querySelector(toSelector)
        if (!newParent) {
          console.error('moveElement(): no parent matching "%s"', toSelector)
          return false
        }
        if (beforeSelector) {
          const before = newParent.querySelector(beforeSelector)
          if (before) {
            newParent.insertBefore(el, before)
            return true
          } else {
            console.warn('moveElement(): before selector "%s" not found; appending', beforeSelector)
          }
        }
        newParent.appendChild(el)
        return true
      } else {
        console.warn('moveElement(): not contained in "%s"', fromSelector)
        return false
      }
    }
  
  })()
