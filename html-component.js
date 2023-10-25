export const htmlComponents = {};

/**
 * Register a reusable HTML component.
 * @param {string} type
 * @param {object} htmlComponent
 * @param {function} htmlComponent.build
 * @param {function} htmlComponent.initialize
 */
export function registerHtmlComponent(type, htmlComponent) {
	htmlComponents[type] = htmlComponent;
}

/**
 * Get HTML string definition and an array of initializers from an HTML component definition.
 * @param {any} componentDefinition
 * @returns {{ htmlStringDefinition: any, initializers: [object] }}
 */
export function buildHtmlComponent(componentDefinition = {}) {
	if (componentDefinition == null) {
		return {
			htmlStringDefinition: null,
			initializers: []
		};
	}

	if (typeof componentDefinition === 'object') {
		if (Array.isArray(componentDefinition)) {
			const htmlStringDefinition = [];
			const initializers = [];

			const length = componentDefinition.length;
			for (let index = 0; index < length; index++) {
				const {
					htmlStringDefinition: resultHtmlStringDefinition,
					initializers: resultInitializers
				} = buildHtmlComponent(componentDefinition[index]);
				htmlStringDefinition.push(resultHtmlStringDefinition);
				initializers.push(...resultInitializers);
			}

			return { htmlStringDefinition, initializers };
		}

		const { type } = componentDefinition;
		if (type) {
			const {
				htmlStringDefinition: resultHtmlStringDefinition,
				initializer = {}
			} = htmlComponents[type].build(componentDefinition);

			const {
				htmlStringDefinition,
				initializers: resultInitializers
			} = buildHtmlComponent(resultHtmlStringDefinition);

			return {
				htmlStringDefinition,
				initializers: [
					...resultInitializers,
					Object.assign(componentDefinition, initializer)
				]
			};
		}

		const { children } = componentDefinition;
		if (children) {
			const { htmlStringDefinition, initializers } = buildHtmlComponent(children);

			return {
				htmlStringDefinition: {
					...componentDefinition,
					children: htmlStringDefinition
				},
				initializers
			};
		}
	}

	return {
		htmlStringDefinition: componentDefinition,
		initializers: []
	};
}

/**
 * Initialize all HTML components using initializers.
 * @param {[object]} initializers
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
