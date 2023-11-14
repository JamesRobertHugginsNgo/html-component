/* global console */

import getId from 'get-id';
import makeHtmlString from 'make-html-string';
import Util from 'util';

import {
	registerHtmlComponent,
	makeHtmlDefinition,
	initialize
} from '../html-component.js';

registerHtmlComponent('test1', {
	makeHtmlDefinition: (definition) => {
		const {
			id = getId('test-1-'),
			message
		} = definition;
		Object.assign(definition, { id });
		return {
			name: 'span',
			attributes: { id },
			children: [
				'Hello ',
				message
			]
		};
	},
	initialize(definition, state) {
		if (state) {
			const { id } = definition;
			const { counter = 0 } = state;
			console.log(counter, id);
			Object.assign(state, { counter: counter + 1 });
		}
	}
});

registerHtmlComponent('test2', {
	makeHtmlDefinition: (definition) => {
		const {
			id = getId('test-2-'),
			message
		} = definition;
		Object.assign(definition, { id });
		return {
			name: 'strong',
			attributes: { id },
			children: [
				'Hello ',
				message
			]
		};
	}
});

function inspect(object) {
	return Util.inspect(object, { showHidden: false, depth: null, colors: true });
}

const componentDefinition = {
	type: 'test1',
	message: [
		{
			type: 'test2',
			message: 'World'
		},
		' ',
		{
			type: 'test1',
			message: 'Universe'
		}
	]
};

const initializers = [];
const htmlDefinition = makeHtmlDefinition(componentDefinition, (definition) => {
	initializers.push(definition);
});

const htmlString = makeHtmlString(htmlDefinition);

console.log('COMPONENT DEFINITION', inspect(componentDefinition));
console.log('HTML DEFINITION', inspect(htmlDefinition));
console.log('HTML STRING', htmlString);

const state = {};
console.log('INITIALIZERS', initializers);
console.group('INITIALIZE');
initialize(initializers, state);
console.groupEnd();
console.log('STATE', state);
