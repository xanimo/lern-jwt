import React, { Component } from 'react';
import { client } from '../utils';

export default class SignUp extends Component {
	state = {
		fields: { 
			name: '',
			email: '', 
			password: '', 
			message: ''
		}
	};

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
		client.signUp(this.state.fields).then(response => {
			const message = response.success === false ? response.message.errmsg : '';
			this.setState({ fields: { 
					name: '', 
					email: '', 
					password: '', 
					message: message 
				} 
			})
			if (this.state.fields.message) {
				console.log('bleh')
			} else if (response) {
				this.props.onSignUpSuccess(response)
				this.props.history.push('/')
			}
		})
	};

	render() {
		const { name, email, password, message } = this.state.fields
		return (
			<form 
			onChange={this.onInputChange.bind(this)}
			onSubmit={this.onFormSubmit.bind(this)}>
			<h1 className="display-4">Sign Up</h1>	
	    		<div className={message ? "alert alert-danger alert-dismissible fade show" : ""} role="alert">
					<h4 className="alert-heading">
					 {message}
					 </h4>
				</div>			  
				<div className="form-group">
			    <label htmlFor="name">Name</label>
			    <input type="text" className="form-control" placeholder="Name" name="name" value={name} />
			  	</div>
			  <div className="form-group">
			    <label htmlFor="email">Email address</label>
				<input
				 className="form-control" 
				 type="email"
				 placeholder="Email" 
				 name="email" 
				 value={email} 
			    aria-describedby="emailHelp" />
			    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
			  </div>
			  <div className="form-group">
			    <label htmlFor="password">Password</label>
				<input 
				type="password" 
			    className="form-control"
				placeholder="Password" 
				name="password" 
				value={password} />
			  </div>
			  <button type="submit" className="btn btn-primary form-control">Submit</button>			
			</form>
		);
	}
}