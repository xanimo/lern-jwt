import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const API_URL = 'https://localhost:3001';

const client = axios.create({
});

client.getToken = function() {
	return localStorage.getItem('token');
}

client.setToken = function(token) {
	localStorage.setItem('token', token);
	return token;
}

client.getCurrentUser = function() {
	const token = this.getToken();
	if (token) return jwtDecode(token);
	return null
}

client.getUsers = () => {
	return JSON.parse(localStorage.getItem("users"));
}

client.fetchUsers = () => {
	if ("users" in localStorage) {
	} else {
		return client.get('/api/users')
		.then((response) => {
			const filteredUsers = response.data.map((user) => {
				const { password, ...responseUser } = user;
				return responseUser;
			})
			localStorage.setItem('users', JSON.stringify(filteredUsers));
			return response.data;
		})
		.catch((error) => {
			return error;
		});
	}
}

client.getProtectedRoute = async function() {
return await this({ 
	method: 'get', 
	url: `${API_URL}/api/private`, 
	data: this.getToken() 
	})
	.then(serverResponse => {
		return serverResponse.data;
	})
	.catch((error) => {
		return error;
	})
}

client.logIn = async function(credentials) {
	const serverResponse = await this({ 
		method: 'post', 
		url: `${API_URL}/api/users/authenticate`, 
		data: credentials 
	});
	const token = serverResponse.data.token;
	if (token) {
		// sets token as an included header for all subsequent api requests
		this.defaults.headers.common.token = this.setToken(token);
		const decodedToken = jwtDecode(token);
		localStorage.setItem('user', decodedToken.sub._id);
		localStorage.setItem('token', token);
		return decodedToken
	} else {
		return serverResponse.data;
	}
}

// logIn and signUp functions could be combined into one since the only difference is the url we're sending a request to..
client.signUp = async function(userInfo) {
	const serverResponse = await this({
		method: 'post',
		url: `${API_URL}/api/users/`,
		data: userInfo
	});
	const token = serverResponse.data.token;
	if (token) {
		// sets token as an included header for all subsequent api requests
		this.defaults.headers.common.token = this.setToken(token);
		return jwtDecode(token);
	} else {
		return serverResponse.data;
	}
}

client.logOut = function() {
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
