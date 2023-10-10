/* global console */

import getId from 'get-id';
import makeHtmlString from 'make-html-string';
import Util from 'util';

import {
	registerHtmlComponent,
	makeHtmlStringDefinition,
	getInitializers,
	initialize
} from './html-component.js';

registerHtmlComponent('text', {
	makeHtmlStringDefinition({
		id = getId('text-'),
		title,
	} = {}) {
		return {
			id,
			name: 'div',
			children: [
				{
					name: 'label',
					attributes: { for: id },
					children: [title || 'Untitled']
				},
				{
					name: 'input',
					attributes: {
						id,
						name: id,
						type: 'text'
					}
				}
			]
		};
	},
	initialize(definition) {
		console.log('text', definition.id);
	}
});

registerHtmlComponent('section', {
	makeHtmlStringDefinition({
		id = getId('section-'),
		title,
		fields = []
	} = {}) {
		return {
			id,
			name: 'div',
			attributes: { id },
			children: [
				title ? {
					name: 'h2',
					children: [title]
				} : null,
				fields
			]
		};
	},
	initialize(definition) {
		console.log('section', definition.id);
	}
});

registerHtmlComponent('form', {
	makeHtmlStringDefinition({
		id = getId('form-'),
		title,
		sections = []
	} = {}) {
		return {
			id,
			name: 'form',
			attributes: { id },
			children: [
				title ? {
					name: 'h1',
					children: [title]
				} : null,
				...sections
			]
		};
	},
	initialize(definition) {
		console.log('form', definition.id);
	}
});

function inspect(object) {
	return Util.inspect(object, { showHidden: false, depth: null, colors: true });
}

const htmlDefinition = makeHtmlStringDefinition({
	type: 'form',
	title: 'Form Title',
	sections: [
		{
			type: 'section',
			title: 'Section Title',
			fields: [
				{
					type: 'text',
					title: 'Text Label'
				},
				{
					type: 'text',
					title: 'Text Label'
				},
				{
					type: 'text',
					title: 'Text Label'
				}
			]
		}
	]
});

console.group('HTML DEFINITION');
console.log(inspect(htmlDefinition));
console.log();
console.groupEnd();

console.group('HTML STRING');
console.log(makeHtmlString(htmlDefinition));
console.log();
console.groupEnd();

const initializers = getInitializers(htmlDefinition);

console.group('INITIALIZERS');
console.group('Promise.resolve()');
const length = initializers.length;
for (let index = 0; index < length; index++) {
	const initializer = initializers[index];
	console.log(`.then(() => htmlComponents['${initializer.type}'].initialize({ ... }));`);
}
console.groupEnd();
console.log();
console.groupEnd();

console.group('INITIALIZE');
initialize(initializers);
console.log();
console.groupEnd();
