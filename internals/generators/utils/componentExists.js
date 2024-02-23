const fs = require('fs'),
	  path = require('path'),
	  pageComponents = fs.readdirSync(path.join(__dirname, '../../../client/src/components')),
	  pageContainers = fs.readdirSync(path.join(__dirname, '../../../client/src/containers')),
	  components = pageComponents.concat(pageContainers);

const componentExists = comp => {
	return components.indexOf(comp) >= 0;
};

module.exports = componentExists;

