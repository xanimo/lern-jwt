import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import dogeauth from 'dogeauth';
import { encryptMessage, decryptMessage } from './crypt';
import { JsonToArray, binArrayToJson } from './json';

const API_URL = 'https://localhost:3001';

const client = axios.create({
});

client.JsonToArray = JsonToArray;

client.binArrayToJson = binArrayToJson;

client.getToken = function () {
	return localStorage.getItem('token');
}

client.setToken = function (token) {
	localStorage.setItem('token', token);
	return token;
}

client.getQuery = function () {
	return JSON.parse(localStorage.getItem("query"));
}

client.setQuery = function (query) {
	localStorage.setItem("query", JSON.stringify(query));
	return query;
}

client.getArgs = function () {
	return JSON.parse(localStorage.getItem("args"));
}

client.setArgs = function (args) {
	localStorage.setItem("args", JSON.stringify(args));
	return args;
}

client.getCurrentUser = function () {
	const token = this.getToken();
	if (token) return jwtDecode(token);
	return null
}

client.getUsers = async () => {
	const encrypted = JSON.parse(localStorage.getItem("users"));
	const decrypted = await decryptMessage(Buffer.from(process.env.REACT_APP_PRIVATE_KEY_HEX, 'hex'), encrypted);
	return JSON.parse(decrypted);
}

client.fetchUsers = async () => {
	if ("users" in localStorage) {
	} else {
		const url = `${API_URL}/api/users`;
		const headers = {
			'x-identity': dogeauth.getPublicKeyFromPrivateKey(process.env.REACT_APP_PRIVATE_KEY_HEX),
			'x-signature': dogeauth.sign(url, process.env.REACT_APP_PRIVATE_KEY_HEX)
		};
		return await client.get(url, headers)
			.then(async(response) => {
				const decrypted = JSON.stringify(JSON.parse(await decryptMessage(Buffer.from(process.env.REACT_APP_PRIVATE_KEY_HEX, 'hex'), response.data)));
				localStorage.setItem('users', JSON.stringify(response.data));
				return JSON.parse(decrypted);
			})
			.catch((error) => {
				return error;
			});
	}
}

client.getProtectedRoute = async function (command, args) {
	const command_encoded = Buffer.from(await this.JsonToArray(command));
	const args_encoded = Buffer.from(await this.JsonToArray(args));
	const encoded = Buffer.concat([command_encoded, args_encoded]);
	console.log('getprotectedroute:', encoded);
	const encrypted = await encryptMessage(Buffer.from(process.env.REACT_APP_PRIVATE_KEY_HEX, 'hex'), encoded);
	const data = { encrypted };

	this.setQuery(command);
	this.setArgs(args);

	const url = `${API_URL}/api/private`;
	const headers = {
		'x-identity': dogeauth.getPublicKeyFromPrivateKey(process.env.REACT_APP_PRIVATE_KEY_HEX),
		'x-signature': dogeauth.sign(url + data, process.env.REACT_APP_PRIVATE_KEY_HEX),
		'data': data.encrypted
	};
	return await this({
		method: 'get',
		url: url,
		body: data,
		headers: headers
	})
	.then(serverResponse => {
		return serverResponse.data;
	})
	.catch((error) => {
		return error;
	})
}

client.logIn = async function (credentials) {
	const encoded = Buffer.from(await this.JsonToArray(credentials));
	const encrypted = await encryptMessage(Buffer.from(process.env.REACT_APP_PRIVATE_KEY_HEX, 'hex'), encoded);
	const data = { encrypted };
	const url = `${API_URL}/api/users/authenticate`;
	const headers = {
		'x-identity': dogeauth.getPublicKeyFromPrivateKey(process.env.REACT_APP_PRIVATE_KEY_HEX),
		'x-signature': dogeauth.sign(url + data, process.env.REACT_APP_PRIVATE_KEY_HEX)
	};
	const serverResponse = await this({
		method: 'post',
		url: url,
		data: data,
		headers: headers
	});
	const decrypted = await decryptMessage(Buffer.from(process.env.REACT_APP_PRIVATE_KEY_HEX, 'hex'), serverResponse.data.encrypted);
	const token = JSON.parse(decrypted);
	if (token) {
		this.defaults.headers.common['x-identity'] = headers['x-identity'];
		this.defaults.headers.common['x-signature'] = headers['x-signature'];
		// sets token as an included header for all subsequent api requests
		this.defaults.headers.common.token = this.setToken(JSON.stringify(serverResponse.data.encrypted));
		const decodedToken = jwtDecode(token);
		localStorage.setItem('user', JSON.stringify(serverResponse.data.encrypted));
		localStorage.setItem('token', token);
		return decodedToken
	} else {
		return serverResponse.data;
	}
}

// logIn and signUp functions could be combined into one since the only difference is the url we're sending a request to..
client.signUp = async function (userInfo) {
	const encoded = Buffer.from(await this.JsonToArray(userInfo));
	const encrypted = await encryptMessage(Buffer.from(process.env.REACT_APP_PRIVATE_KEY_HEX, 'hex'), encoded);
	const url = `${API_URL}/api/users/`;
	const data = { encrypted };
	const headers = {
		'x-identity': dogeauth.getPublicKeyFromPrivateKey(process.env.REACT_APP_PRIVATE_KEY_HEX),
		'x-signature': dogeauth.sign(url + data, process.env.REACT_APP_PRIVATE_KEY_HEX)
	};
	const serverResponse = await this({
		method: 'post',
		url: `${API_URL}/api/users/`,
		data: data
	});
	console.log(serverResponse);
	console.log(serverResponse.data);
	const token = serverResponse.data.token;
	if (token) {
		// sets token as an included header for all subsequent api requests
		this.defaults.headers.common['x-identity'] = headers['x-identity'];
		this.defaults.headers.common['x-signature'] = headers['x-signature'];
		this.defaults.headers.common.token = this.setToken(token);
		return await jwtDecode(token);
	} else {
		return await serverResponse.data;
	}
}

client.update = async function (credentials) {
	console.log('creds', credentials);
	console.log('creds', credentials['id']);
	console.log(await this.JsonToArray(credentials));
	const encoded = Buffer.from(await this.JsonToArray(credentials));
	console.log(encoded);
	const encrypted = await encryptMessage(Buffer.from(process.env.REACT_APP_PRIVATE_KEY_HEX, 'hex'), encoded);
	console.log(encrypted);
	// const decrypted = await decryptMessage(Buffer.from(process.env.REACT_APP_PRIVATE_KEY_HEX, 'hex'), encrypted);
	// console.log(decrypted);
	const data = { encrypted };
	const url = `${API_URL}/api/users/${credentials.id}`;
	const headers = {
		'x-identity': dogeauth.getPublicKeyFromPrivateKey(process.env.REACT_APP_PRIVATE_KEY_HEX),
		'x-signature': dogeauth.sign(url + data, process.env.REACT_APP_PRIVATE_KEY_HEX)
	};
	const serverResponse = await this({
		method: 'patch',
		url: url,
		data: data,
		headers: headers
	});
	console.log('data', serverResponse.data);
	console.log('token', serverResponse.data.token);
	console.log('encrypted', serverResponse.data.encrypted);
	const decrypted = await decryptMessage(Buffer.from(process.env.REACT_APP_PRIVATE_KEY_HEX, 'hex'), serverResponse.data.encrypted);
	console.log('decrypted', decrypted);
	const token = JSON.parse(decrypted);
	if (token) {
		this.defaults.headers.common['x-identity'] = headers['x-identity'];
		this.defaults.headers.common['x-signature'] = headers['x-signature'];
		// sets token as an included header for all subsequent api requests
		this.defaults.headers.common.token = this.setToken(token);
		const decodedToken = jwtDecode(token);
		console.log(decodedToken);
		localStorage.setItem('user', serverResponse.data.encrypted);
		localStorage.setItem('token', token);
		return serverResponse.data;
	}
}

client.logOut = function () {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
	localStorage.removeItem('users');
	delete this.defaults.headers.common.token
	return true
}

// During initial app load attempt to set a localStorage stored token
// as a default header for all api requests.
client.defaults.headers.common.token = client.getToken()
export default client
