const fs = require('fs'),
	  path = require('path'),
	  componentGenerator = require('./component/index.js'),
	  containerGenerator = require('./container/index.js');

module.exports = (plop) => {
	plop.setGenerator('component', componentGenerator);
	plop.setGenerator('container', containerGenerator);
	plop.addHelper('directory', (comp) => {
		try {
			fs.accessSync(path.join(__dirname, `../../client/src/containers/${comp}`), fs.F_OK);
			return `containers/${comp}`;
		} catch (e) {
			return `component/${comp}`;
		}
	});
	plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
}