# html-component

A system for creating and using HTML components.

## Installation

```
npm install --save https://github.com/JamesRobertHugginsNgo/html-component.git#1.0.0
```

## Registering an HTML Component

``` JavaScript
import { registerHtmlComponent } from 'html-component';

const htmlComponent = {
	makeHtmlStringDefinition(componentDefinition = {}) {
		const { id, message } = componentDefinition;
		const htmlStringDefinition = {
			name: 'p',
			attributes: { id },
			children: [message]
		};
		return htmlStringDefinition;
	},

	initialize(htmlStringDefinition = {}) {
		const { attributes } = htmlStringDefinition;
		const { id } = attributes;
		const reference = document.getElementById(id);
		console.log(reference);
	}
};

registerHtmlComponent('component-name', htmlComponent);
```

## Using a Registered HTML Component

``` JavaScript
import { makeHtmlStringDefinition, getInitializers, initialize  } from 'html-component';
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

const htmlStringDefinition = makeHtmlStringDefinition(componentDefinition);

const htmlString = makeHtmlString(htmlStringDefinition);
document.body.innerHTML = htmlString;

const initializers = getInitializers(htmlStringDefinition);
initialize(initializers);

```
