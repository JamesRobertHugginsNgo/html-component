export const htmlComponents = {};

/**
 * Register a reusable HTML component object.
 * @param {string} type
 * @param {object} htmlComponent
 * @param {function} htmlComponent.makeHtmlDefinition
 * @param {function} htmlComponent.initialize
 */
export function registerHtmlComponent(type, htmlComponent) {
	htmlComponents[type] = htmlComponent;
}

/**
 * Turn an HTML component definition to HTML string definition.
 * @param {any} definition
 * @returns {any}
 */
export function makeHtmlDefinition(definition = {}, callback) {
	if (definition == null) {
		return null;
	}

	if (typeof definition === 'object') {
		if (Array.isArray(definition)) {
			const htmlStringDefinition = [];
			const length = definition.length;
			for (let index = 0; index < length; index++) {
				htmlStringDefinition.push(makeHtmlDefinition(definition[index], callback));
			}
			return htmlStringDefinition;
		}

		const { type } = definition;
		if (type) {
			const htmlComponent = typeof type === 'object'
				? type
				: htmlComponents[type];
			const value = makeHtmlDefinition(
				htmlComponent.makeHtmlDefinition(definition),
				callback
			);
			if (callback) {
				callback(definition);
			}
			return value;
		}

		const { children } = definition;
		if (children) {
			return {
				...definition,
				children: makeHtmlDefinition(children, callback)
			};
		}
	}

	return definition;
}

/**
 * Initialize all HTML components.
 * @param {[object]} definitions
 * @param {object} state
 * @returns {undefined | Promise}
 */
export function initialize(definitions = [], state) {
	let promise;

	const length = definitions.length;
	for (let index = 0; index < length; index++) {
		const definition = definitions[index];
		const { type } = definition;
		const htmlComponent = typeof type === 'object'
		? type
		: htmlComponents[type];
		if (!htmlComponent.initialize) continue;

		if (promise) {
			promise = promise.then(() => {
				return htmlComponent.initialize(definition, state);
			});
			continue;
		}

		const result = htmlComponent.initialize(definition, state);
		if (result instanceof Promise) {
			promise = result;
		}
	}

	return promise;
}
