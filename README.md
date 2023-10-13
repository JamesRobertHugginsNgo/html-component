# html-component

A system for creating and using HTML components.

## Installation

```
npm install --save https://github.com/JamesRobertHugginsNgo/html-component.git#2.0.1
```

## Registering an HTML Component

``` JavaScript
import { registerHtmlComponent } from 'html-component';

const htmlComponent = {
	build(definition = {}) {
		const { id, message } = definition;

		const htmlStringDefinition = {
			name: 'p',
			attributes: { id },
			children: [message]
		};

		const initializer = {};

		return { htmlStringDefinition, initializer };
	},

	initialize(definition, state) {
		console.log(definition, state);
	}
};

registerHtmlComponent('component-name', htmlComponent);
```

## Using a Registered HTML Component

``` JavaScript
import { buildHtmlComponent, initialize  } from 'html-component';
import makeHtmlString from 'make-html-string';

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
