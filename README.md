# html-component

A system for creating and using HTML components.

## Installation

```
npm install https://github.com/JamesRobertHugginsNgo/html-component.git#2.0.1
```
### HTML Component

``` JavaScript
// File: make-html-component.js

/**
 * A reusable custom HTML component.
 * @type {object}
 * @oroperty {function} [build]
 * @oroperty {function} [initializer]
 */
export default const htmlComponent = {

  /**
   * Returns HTML string definition and an optional initializer object.
   * @param {object} componentDefinition
   * @returns {{ htmlStringDefinition: any, initializer?: object }}
   */
  build(componentDefinition) {
    const { id, message } = componentDefinition;

    const htmlStringDefinition = {
      name: 'p',
      attributes: { id },
      children: [message]
    };

    const initializer = {};

    return { htmlStringDefinition, initializer };
  },

  /**
   * Initialize the component based on initializer object.
   * @param {object} initializer
   * @param {object} [state]
   * @returns {undefined|Promise}
   */
  initialize(initializer, state) {
    console.log(initializer, state);
  }
};
```

## Registering HTML Component

``` JavaScript
// File: register-html-component.js

import { registerHtmlComponent } from 'html-component';
import htmlComponent from './make-html-component.js';

registerHtmlComponent('component-name', htmlComponent);
```

## Using a Registered HTML Component

``` JavaScript
// File: build-html-component.js

import { buildHtmlComponent, initialize  } from 'html-component';
import makeHtmlString from 'make-html-string';

import './register-html-component.js';

const componentDefinition = {
  name: 'div',
  children: [
    {
      type: 'component-name',
      id: 'hello-world-id',
      message: 'Hello World'
    }
  ]
};

const {
  htmlStringDefinition,
  initializers
} = buildHtmlComponent(componentDefinition);

const htmlString = makeHtmlString(htmlStringDefinition);
document.body.innerHTML = htmlString;

const state = {};
initialize(initializers, state);
```
