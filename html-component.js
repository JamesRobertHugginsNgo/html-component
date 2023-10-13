export const htmlComponents = {};

/**
 * @param {string} type
 * @param {object} htmlComponent
 * @param {function} htmlComponent.build
 * @param {function} htmlComponent.initialize
 */
export function registerHtmlComponent(type, htmlComponent) {
	htmlComponents[type] = htmlComponent;
}

/**
 * @param {any} definition
 * @returns {any}
 */
export function buildHtmlComponent(definition = {}) {
	if (Array.isArray(definition)) {
		const htmlStringDefinition = [];
		const initializers = [];

		const length = definition.length;
		for (let index = 0; index < length; index++) {
			const {
				htmlStringDefinition: resultHtmlStringDefinition,
				initializers: resultInitializers
			} = buildHtmlComponent(definition[index]);
			htmlStringDefinition.push(resultHtmlStringDefinition);
			initializers.push(...resultInitializers);
		}

		return { htmlStringDefinition, initializers };
	}

	if (definition && typeof definition === 'object') {
		const { type } = definition;
		if (type) {
			const {
				htmlStringDefinition: buildHtmlStringDefinition,
				initializer = {}
			} = htmlComponents[type].build(definition);

			Object.assign(definition, initializer);

			const {
				htmlStringDefinition,
				initializers: resultInitializers
			} = buildHtmlComponent(buildHtmlStringDefinition);

			return {
				htmlStringDefinition,
				initializers: [
					...resultInitializers,
					definition
				]
			};
		}

		const { children } = definition;
		if (children) {
			const { htmlStringDefinition, initializers } = buildHtmlComponent(children);

			return {
				htmlStringDefinition: {
					...definition,
					children: htmlStringDefinition
				},
				initializers
			};
		}
	}

	return {
		htmlStringDefinition: definition,
		initializers: []
	};
}

/**
 * @param {[any]} initializers
 * @returns {undefined | Promise}
 */
export function initialize(initializers = [], state = {}) {
	let promise;

	const length = initializers.length;
	for (let index = 0; index < length; index++) {
		const initializer = initializers[index];
		const { type } = initializer;
		const result = htmlComponents[type].initialize(initializer, state);
		if (result instanceof Promise && !promise) {
			promise = Promise.resolve();
		}
		if (promise) {
			promise = promise.then(() => {
				return result;
			});
		}
	}

	return promise;
}
