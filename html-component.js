export const htmlComponents = {};

/**
 * @param {string} type
 * @param {object} htmlComponent
 * @param {function} htmlComponent.makeHtmlStringDefinition
 * @param {function} htmlComponent.initialize
 */
export function registerHtmlComponent(type, htmlComponent) {
	htmlComponents[type] = htmlComponent;
}

/**
 * @param {any} componentDefinition
 * @returns {object}
 */
export function makeHtmlStringDefinition(componentDefinition = {}) {
	if (Array.isArray(componentDefinition)) {
		const htmlStringDefinition = [];

		const length = componentDefinition.length;
		for (let index = 0; index < length; index++) {
			const result = makeHtmlStringDefinition(componentDefinition[index]);
			if (result == null) continue;

			htmlStringDefinition.push(result);
		}

		return htmlStringDefinition;
	}

	if (componentDefinition && typeof componentDefinition === 'object') {
		const htmlStringDefinition = {};

		const { type } = componentDefinition;
		Object.assign(htmlStringDefinition, !type ? componentDefinition: {
			type,
			...htmlComponents[type].makeHtmlStringDefinition(componentDefinition)
		});

		const { children } = htmlStringDefinition;
		if (children) {
			htmlStringDefinition.children = makeHtmlStringDefinition(children);
		}

		return htmlStringDefinition;
	}

	return componentDefinition;
}

/**
 * @param {any} htmlStringDefinition
 * @returns {[any]}
 */
export function getInitializers(htmlStringDefinition = {}) {
	const initializers = [];

	if (Array.isArray(htmlStringDefinition)) {
		const length = htmlStringDefinition.length;
		for (let index = 0; index < length; index++) {
			initializers.push(...getInitializers(htmlStringDefinition[index]));
		}
	} else if (htmlStringDefinition && typeof htmlStringDefinition === 'object') {
		const { children } = htmlStringDefinition;
		if (children) {
			initializers.push(...getInitializers(children));
		}

		const { type } = htmlStringDefinition;
		if (type && htmlComponents[type].initialize) {
			initializers.push(htmlStringDefinition);
		}
	}

	return initializers;
}

/**
 * @param {[any]} initializers
 * @returns {undefined | Promise}
 */
export function initialize(initializers = []) {
	let promise;

	const length = initializers.length;
	for (let index = 0; index < length; index++) {
		const initializer = initializers[index];
		const { type } = initializer;
		const result = htmlComponents[type].initialize(initializer);
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
