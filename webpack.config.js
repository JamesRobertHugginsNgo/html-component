import Path from 'node:path';

export default {
	entry: './html-component.js',
	output: {
		path: Path.resolve('dist'),
		filename: 'html-component.js',
		library: {
			name: 'HtmlComponent',
			type: 'umd'
		}
	}
};
