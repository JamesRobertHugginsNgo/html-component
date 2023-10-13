/* global console document */

import getId from 'get-id';
import makeHtmlString from 'make-html-string';

import {
	registerHtmlComponent,
	buildHtmlComponent,
	initialize
} from '../../html-component.js';

registerHtmlComponent('text', {
	build({
		id = getId('text-'),
		title,
	}) {
		return {
			htmlStringDefinition: [
				{
					id,
					name: 'div',
					attributes: {
						id: `${id}-field`
					},
					children: [
						{
							name: 'label',
							attributes: {
								for: id
							},
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
				}
			],
			initializer: { id }
		};
	},
	initialize(definition, state = {}) {
		console.log('text', definition.id);
		state[definition.id] = 'text';
	}
});

registerHtmlComponent('section', {
	build({
		id = getId('section-'),
		title,
		fields = []
	}) {
		return {
			htmlStringDefinition: {
				id,
				name: 'div',
				attributes: { id },
				children: [
					title ? {
						name: 'h2',
						children: [title]
					} : null,
					fields
				],
			},
			initializer: {
				id,
				fields
			}
		};
	},
	initialize(definition, state = {}) {
		console.log('section', definition.id);
		state[definition.id] = 'section';
	}
});

registerHtmlComponent('form', {
	build({
		id = getId('form-'),
		title,
		sections = []
	}) {
		return {
			htmlStringDefinition: {
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
			},
			initializer: {
				id,
				sections
			}
		};
	},
	initialize(definition, state) {
		console.log('form', definition.id);
		state[definition.id] = 'form';
	}
});

function inspect(object) {
	return object;
}

const componentDefinition = {
	type: 'form',
	title: 'Form Title',
	sections: [
		{
			type: 'section',
			title: 'Section Title',
			fields: [
				{
					type: 'text',
					title: 'Text Label 1'
				},
				{
					type: 'text',
					title: 'Text Label 2'
				},
				{
					type: 'text',
					title: 'Text Label 3'
				}
			]
		}
	]
};

const {
	htmlStringDefinition: htmlDefinition,
	initializers
} = buildHtmlComponent(componentDefinition);

console.group('HTML DEFINITION');
console.log(inspect(htmlDefinition));
console.log();
console.groupEnd();

const htmlString = makeHtmlString(htmlDefinition);
document.body.innerHTML = htmlString;

console.group('HTML STRING');
console.log(htmlString);
console.log();
console.groupEnd();

console.group('INITIALIZERS');
console.log(inspect(initializers));
console.log();
console.groupEnd();

const state = {};

console.group('INITIALIZE');
initialize(initializers, state);
console.log();
console.groupEnd();

console.group('STATE');
console.log(inspect(state));
console.log();
console.groupEnd();
