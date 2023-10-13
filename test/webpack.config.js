import Path from 'path';
import { fileURLToPath, URL } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default {
	entry: Path.resolve(__dirname, './src/index.js'),
	output: {
		path: Path.resolve(__dirname, './dist'),
		filename: 'index.js',
	}
};
