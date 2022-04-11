# Form manager configurations

This repo contains bits and bobs for use in Form.io [form manager configurations]. It's published on GitHub Pages so that files (primarily images, CSS, and JavaScript) can have public URLs.

## Setup

1. Sign in as a form.io administrator on [formio.sfgov.org]
2. Navigate to your stage in the tabs along the top, e.g. [Development][dev stage]
3. Select the <kbd>Settings</kbd> button at the bottom of the left-hand nav bar
4. Under the "Stage Settings" navigation, select "Public Configuration"
5. In the settings form:

    - Check "Enable Public Configurations"
    - In the table, add the following values:
  
        | Key | Value |
        | :-- | :---- |
        | `title` | (your title here) |
        | `logo` | `https://sf.gov/themes/custom/sfgovpl/logo.svg` |
        | `logoHeight` | `56` |
        | `js` | `https://sfdigitalservices.github.io/formio-public-config/preview.js` |

    Leave the "JSON" checkboxes unchecked.

    <details>
      <summary><b>Show me what this looks like</b></summary>
      <img width="729" alt="image" src="https://user-images.githubusercontent.com/113896/162837822-e18259f6-6766-430c-903f-a40a12bfada8.png">
    </details>
    
6. Select the <kbd>Save</kbd> button to save your changes


## JavaScript

[preview.js](./preview.js) is the JavaScript that does all of the work to modify the Form Manager interface. It applies these "hacks" using [mutation observers][mutation observer] and targeting elements with specific CSS selectors. All of the individual changes are described in the object passed to the `observe()` function:

```js
observe({
  '.some-selector': el => {
    el.classList.remove('blah')
    el.classList.replace('some-class', 'another-class')
  }
})
```

See the [classList] docs for documentation of the ways you can modify classes on an element without touching its `className` or `class` attribute.

[formio.sfgov.org]: https://formio.sfgov.org/
[dev stage]: https://formio.sfgov.org/#/project/60da60c968de9779841a38ab/env/settings/config
[form manager configurations]: https://help.form.io/userguide/form-manager#form-manager-configurations
[mutation observer]: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
[classlist]: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
