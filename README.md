# html-component

JavaScript module for a reusable way of making [make-html-string](https://github.com/JamesRobertHugginsNgo/make-html-string) definitions, and a way to define JavaScript code initializers.

## NPM Installation

```
npm install https://github.com/JamesRobertHugginsNgo/html-component.git#3.0.1
```

## Constant Variable: htmlComponents

Type: `object`.

A dictionary of registered HTML component.

## Function: registerHtmlComponent(type, htmlComponent)

Argument | Type | Description
-- | -- | --
`type` | `string` | `type` value of `makeHtmlDefinition`'s `definition` argument.
`htmlComponent` | `object` | An object containing a `makeHtmlDefinition` function and an optional `initialize` function.

## Function: makeHtmlDefinition(definition, callback)

Argument | Type | Description
-- | -- | --
`definition` | `string` | _Optional_. Similar to the `definition` argument for the [make-html-string](https://github.com/JamesRobertHugginsNgo/make-html-string) function, but also allows custom definition used by HTML component. HTML component is defined by the `type` definition. _Default to `{}`_
`callback` | `function` | _Optional_. Called after an HTML component calls its `makeHtmlDefinition` function passing the current HTML component's `definition` in the order when they finish. Use `callback` to generate the `definitions` argument for the `initialize` function.

Return type: `any`.

Return value can be used as `defination` argument for the [make-html-string](https://github.com/JamesRobertHugginsNgo/make-html-string) function.

## Function: initialize(definitions, state)

Argument | Type | Description
-- | -- | --
`definitions` | `[object]` | A array of HTML component definition, in the order of execution.
`state` | `object` | _Optional_. A way to share values with other component and with the web application.

Return type: `undefined` or `promise`.

This function executes each HTML component's `initialize` function in sequence. When the `initialize` function returns a `Promise`, it will use the promise chain to ensure the functions are executed in the right order.

## Using Script Tag

The JavaScript library (found in the "dist" folder) can be used directly using an HTML script tag. The JavaScript module is exposed as a global `HtmlComponent` namespace.

``` HTML
<script src="node_modules/html-component/dist/html-component.js"></script>
<script>
  const {
    htmlComponents,
    registerHtmlComponent,
    makeHtmlDefinition,
    initialize
   } = HtmlComponent;
</script>
```
