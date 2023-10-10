export const htmlComponents = {};

export function registerHtmlComponent(type, htmlComponent) {
	htmlComponents[type] = htmlComponent;
}

export function makeHtmlStringDefinition(definition = {}) {
	if (Array.isArray(definition)) {
		const length = definition.length;
		for (let index = 0; index < length; index++) {
			definition[index] = makeHtmlStringDefinition(definition[index]);
		}

	} else if (definition && typeof definition === 'object') {
		const { type } = definition;
		if (type) {
			definition = { type, ...htmlComponents[type].makeHtmlStringDefinition(definition) };
		}

		const { children } = definition;
		if (children) {
			definition.children = makeHtmlStringDefinition(children);
		}
	}

	return definition;
}

export function getInitializers(definition = {}) {
	const initializers = [];

	if (Array.isArray(definition)) {
		const length = definition.length;
		for (let index = 0; index < length; index++) {
			initializers.push(...getInitializers(definition[index]));
		}
	} else if (definition && typeof definition === 'object') {
		const { children } = definition;
		if (children) {
			initializers.push(...getInitializers(children));
		}

		const { type } = definition;
		if (type && htmlComponents[type].initialize) {
			initializers.push(definition);
		}
	}

	return initializers;
}

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
