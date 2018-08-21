import React, { Component } from 'react';
import { client } from '../utils';
import './LogIn.css';

export default class Login extends Component {
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
		client.logIn(this.state.fields)
			.then(response => {
			return response.success  === false ? (
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
						message: '' 
					}
				}),
				response ? (
					this.props.onLoginSuccess(response),
					this.props.history.push('/')
				) : (
					''
				)
			)
		})
	};

	render() {
	const { email, password, message } = this.state.fields,
		  title = window.location.pathname.split('/')[1].toUpperCase(),
		  figlet = require('figlet');

	figlet.defaults({
		fontPath: 'assets/fonts'
	});

		const update = () => {
			let value = ['loading...'];
			//bell/big/invita/smisome1
			figlet(title, {
				font: 'lcd',
				horizontalLayout: 'universal smushing',
				verticalLayout: 'universal smushing'
			}, (err, text) => {
				if (err) {
					console.dir(err);
					return;
				};
				if (text) {
					value.unshift(text);			
				}
			});
			if (value[0]) {
				return `<pre>${value[0]}</pre>`;		
			};
		};
		return (
			<div>
			<div className="login text-center">
			<form 
			className="form-signin"
			onChange={this.onInputChange.bind(this)}
			onSubmit={this.onFormSubmit.bind(this)}>
			<img className="mb-4" src="./assets/images/logo6.png" alt="" width="100" height="auto" />
			<div className="text-center" dangerouslySetInnerHTML={{__html: update() }} />
			  <div className={message.length ? "alert alert-danger alert-dismissible fade show shadow-pop-tl" : ""} role="alert">
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
				 value={email} 
			    aria-describedby="emailHelp" required autoFocus/>
			  </div>
			  <div className="form-group rounded shadow-pop-tl">
			    <label htmlFor="password" className="sr-only">Password</label>
				<input 
				type="password" 
			    className="form-control rounded"
				placeholder="Password" 
				name="password" 
				value={password} required/>
			  </div>
			  <button type="submit" className="btn btn-lg btn-success btn-block shadow-pop-tl">Submit</button>
			  <p className="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
			</form>
			</div>
			</div>
		);
	}
}