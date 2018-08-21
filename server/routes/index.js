const path = require('path'),
	  user = require('./user');
	  // postRoutes = require('./post'),
	  // tagRoutes = require('./tag');
	  // pageRoutes = require('./page'),
	  // fileRoutes = require('./file');


module.exports.init = (app) => {
	// app.use('/api/posts', postRoutes);
	// app.use('/api/tags', tagRoutes);
	// app.use('/api/pages', pageRoutes);
	// app.use('/upload', fileRoutes);
	app.use('/api/users', user);

	app.get('/.well-known/acme-challenge/s2l7E_SmDBQDRTuDPo7qcUoGLxpaaKoHwZLopGta5Iw', function(req, res) {
		res.send('s2l7E_SmDBQDRTuDPo7qcUoGLxpaaKoHwZLopGta5Iw.AcJbS4tNX5qKtI2r_4Alt22POH6ivFPImtktVAVgnDU')
	});

	app.get('/api/public', function(req, res) {
		console.log(process.env.PORT)
	  res.json({ message: "Hello from a public endpoint! You don't need to be authenticated to see this." });
	});

	// app.get('/api/private', checkJwt, checkScopes, function(req, res) {
	//   res.json({ message: "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this." });
	// });
}