import axios from 'axios'
import jwtDecode from 'jwt-decode'

const client = axios.create({
});

client.getToken = function() {
	return localStorage.getItem('token')
}

client.setToken = function(token) {
	localStorage.setItem('token', token)
	return token
}

client.getCurrentUser = function() {
	const token = this.getToken()
	if (token) return jwtDecode(token)
	return null
}

client.logIn = function(credentials) {
	return this({ method: 'post', url: 'api/users/authenticate', data: credentials })
		.then(serverResponse => {
			const token = serverResponse.data.token
			if(token) {
				// sets token as an included header for all subsequent api requests
				this.defaults.headers.common.token = this.setToken(token)
				return jwtDecode(token)
			} else {
				return serverResponse.data;
			}
		})
}

// logIn and signUp functions could be combined into one since the only difference is the url we're sending a request to..
client.signUp = function(userInfo) {
	return this({ 
		method: 'post', 
		url: '/api/users', 
		data: userInfo,
		withCredentials: true
		})
		.then((serverResponse) => {
			const token = serverResponse.data.token
			if(token) {
				// sets token as an included header for all subsequent api requests
				this.defaults.headers.common.token = this.setToken(token)
				return jwtDecode(token)
			} else {
				return serverResponse.data;
			}
		})
}

client.logOut = function() {
	localStorage.removeItem('token')
	delete this.defaults.headers.common.token
	return true
}

// During initial app load attempt to set a localStorage stored token
// as a default header for all api requests.
client.defaults.headers.common.token = client.getToken()
export default client