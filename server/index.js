const express = require('express'),
	  session = require('express-session'),
	  bodyParser = require('body-parser'),
	  cookieParser = require('cookie-parser'),
	  compression = require('compression'),
	  morgan = require('morgan'),
	  fs = require('fs'),
	  path = require('path'),
	  http = require('http'),
	  https = require('https'),
	  cors = require('cors'),
	  helmet = require('helmet'),
	  csrf = require('csrf'),
	  routes = require('./routes'),
	  db = require('./db'),
	  whitelist = ['https://localhost:3000', 'https://localhost:3001', 'http://localhost:3000', 'http://localhost:3001'];

module.exports.start = (config) => {
	const app = express(),
		  port = config.port,
		  optionsDelegate = function(req, callback) {
		  	let options;
		  	if (whitelist.indexOf(req.header('Origin')) !== -1) {
		  		options = { origin: true }
		  	} else {
		  		options = { origin: false }
		  	};
		  	callback(null, options);
		  },
		  configSSL = {
		  	key: fs.readFileSync(path.resolve(__dirname, 'config/sslcerts/server.key')),
		  	cert: fs.readFileSync(path.resolve(__dirname, 'config/sslcerts/server.crt')),
		    requestCert: false,
		    rejectUnauthorized: false
		  },
		  client = {
		  	remoteAddress: '',
		  	remotePort: '',
		  	localAddress: '',
		  	localPort: ''
		  },
		  limiter = require('express-limiter')(app, routes);

	limiter({
		lookup: ['connection.remoteAddress'],
		total: 300,
		expire: 1000 * 60 * 60
	});

	app.set('port', port);

	app.use(compression());
	app.use(cors(optionsDelegate));

	if (process.env.NODE_ENV === 'production') {
		app.use(express.static('client/build'));
	}

	app.use(
		helmet({
		  hsts: {
			maxAge: 31536000,
		  },
		  contentSecurityPolicy: {
			useDefaults: false,
			directives: {
			  "default-src": [`'self' http://localhost:3000 https://localhost:3001/favicon.ico`],
			  "frame-ancestors": ["'self'"],
			},
		  },
		  frameguard: {
			action: "deny",
		  },
		}))

	if (process.env.NODE_ENV === 'test') {
		app.use(morgan(() => {
			return null;
		}));
	} else {
		app.use(morgan('API Request (port ' + port + '): :method :url :status :response-time ms - :res[content-length]'));
	}

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(cookieParser());

	db.init(config);

	routes.init(app);

	app.use(express.static(path.resolve(__dirname, '..', '..', 'public')))

	app.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials", true);
    	next();
    });

    app.use((err, req, res, next) => {
    	res.locals.message = err.message;
    	res.locals.error = req.app.get('env') === 'development' ? err : err;
    	const errStatus = err.status || 500;
    	res.status(errStatus);
    	res.json({
    		error: errStatus.toString()
    	});
    });

    if (configSSL.key.length && process.env.NODE_ENV == 'production') {
		server = https.createServer(configSSL, app);
    } else {
    	server = http.createServer(app);
    };

	server.listen(port, function() {
		console.log('App running on ' + port);
	});

	function onError(error) {
		if (error.syscall !== 'listen') {
		  throw error;
		}

		const bind = typeof port === 'string'
		  ? `Pipe ${port}`
		  : `Port ${port}`;

		switch (error.code) {
		  case 'EACCES':
		    console.error(`${bind} requires elevated privileges`);
		    process.exit(1);
		    break;
		  case 'EADDRINUSE':
		    console.error(`${bind} is already in use`);
		    process.exit(1);
		    break;
		  case 'EBADCSRFTOKEN': 
		  	console.error(`${bind} for has been tampered with`);
		    process.exit(1);
		  	break;
		  default:
		    throw error;
		}
	}

	function onListening() {
		const addr = server.address();
		const bind = typeof addr === 'string'
		  ? `pipe ${addr}`
		  : `port ${addr.port}`;
		console.log(`Listening on ${bind}`);
	}

	server.on('error', onError);
	server.on('listening', onListening);

	return app;
}