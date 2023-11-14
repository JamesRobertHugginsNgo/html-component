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
 * @returns {{ htmlStringDefinition: any, initializers: [object] }}
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
			const value = makeHtmlDefinition(
				htmlComponents[type].makeHtmlDefinition(definition),
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
 * @param {[object]} initializers
 * @param {object} state
 * @returns {undefined | Promise}
 */
export function initialize(initializers = [], state) {
	let promise;

	const length = initializers.length;
	for (let index = 0; index < length; index++) {
		const definition = initializers[index];
		const { type } = definition;
		if (!htmlComponents[type].initialize) continue;

		const result = htmlComponents[type].initialize(definition, state);
		if (result instanceof Promise && !promise) {
			promise = result;
			continue;
		}

		if (promise) {
			promise = promise.then(() => {
				return result;
			});
		}
	}

	return promise;
}
