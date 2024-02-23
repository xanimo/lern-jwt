import React, { Component, useState } from 'react';
import { client } from "../utils";
import history from "history/browser";
import './LogIn.css';

const logInUser = client.LogIn;

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			title: '',
			fields: { email: '', password: '', message: '' }
		}
	}

	onInputChange(e) {
		this.setState({
			fields: {
				...this.state.fields,
				[e.target.name]: e.target.value
			}
		});
	};

	onFormSubmit(e) {
		e.preventDefault();
		const res = client.logIn(this.state.fields)
			.then(response => {
				console.log(response);
			return response.success === false ? (
				this.setState({
					fields: { 
						email: '', 
						password: '', 
						message: response.message 
					}
				})
			) : (
				this.setState({ 
					fields: { 
						email: '', 
						password: '', 
						message: response.message
					}
				}),
				history.push('/dashboard'),
				window.location.reload()
			)
		});
		console.log(res);
	};

	render() {
	const { email, password, message } = this.state.fields;
		return (
			<div>
			<div className="login text-center">
			<form 
			className="form-signin"
			onChange={this.onInputChange.bind(this)}
			onSubmit={this.onFormSubmit.bind(this)}>
			<div className={message ? "alert alert-danger alert-dismissible fade show shadow-pop-tl" : ""} role="alert">
				<h4 className="alert-heading">
				{message}
				</h4>
			</div>
			  <div className="form-group rounded shadow-pop-tl">
			    <label htmlFor="email" className="sr-only">Email address</label>
				<input
				 className="form-control rounded" 
				 type="email"
				 placeholder="Email address" 
				 name="email" 
				 defaultValue={email} 
			    aria-describedby="emailHelp" required autoFocus/>
			  </div>
			  <div className="form-group rounded shadow-pop-tl">
			    <label htmlFor="password" className="sr-only">Password</label>
				<input 
				type="password" 
			    className="form-control rounded"
				placeholder="Password" 
				name="password" 
				defaultValue={password} required/>
			  </div>
			  <button type="submit" className="btn btn-lg btn-success btn-block shadow-pop-tl">Submit</button>
			  <p className="mt-5 mb-3 text-muted">&copy; 2017-2024</p>
			</form>
			</div>
			</div>
		);
	}
}

export default Login;