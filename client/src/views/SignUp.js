import React, { useState } from 'react';
import { client } from '../utils';
import history from "history/browser";

const SignUp = (props) => {
	const [firstName, setFName] = useState("");
	const [lastName, setLName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password_one, setPasswordOne] = useState("");
	const [password_two, setPasswordTwo] = useState("");
	const [message, setMessage] = useState("");

	const onFormSubmit = (e) => {
		e.preventDefault();
		const errors = validate({ firstName, lastName, email, password_one, password_two });
		if (Object.keys(errors).length > 0) {
			{Object.keys(errors).map((fieldname) => {
				setMessage(errors[fieldname]);
			})}
			return errors;
		}
		client.signUp({ firstName, lastName, email, password })
		.then(response => {
			console.log(response);
			const message = response.success === false ? response.message.errmsg : '';
			setMessage(message);
			if (message.length == 0) {
				history.push('/dashboard');
				window.location.reload();
			}
		})
		.catch((error) => {
			setMessage(error.response.data.error);
		})
	};

	const validate = props => {
		const errors = {};
		const fields = ['firstName', 'lastName', 'email', 'password_one', 'password_two'];
		fields.forEach((f) => {
			if (!(f in props)) {
				errors[f] = `${f} is required`;
			}
		});
	
		if (props.firstname && props.firstname.length > 20) {
			errors.firstname = "maximum of 20 characters!";
		}
	
		if (props.lastname && props.lastname.length < 3) {
			errors.lastname = "minimum of 4 characters!";
		}
	
		if (props.lastname && props.lastname.length > 20) {
			errors.lastname = "maximum of 20 characters!";
		}
	
		if (props.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i.test(props.email)) {
			errors.email = "please provide a valid email!";
		}
	
		if (props.password_one && props.password_one.length < 6) {
			errors.password_one = "minimum 6 characters!";
		}
	
		if (props.password_one !== props.password_two) {
			errors.password_two = "passwords do not match!";
		}

		return errors;
	}
	
		return (
			<form
				className="form-signin"
				onChange={validate.bind(this)}
				onSubmit={onFormSubmit.bind(this)}>
				<div className={message ? "alert alert-danger alert-dismissible rounded shadow-pop-tl fade show" : ""} role="alert">
					<h4 className="alert-heading">
						{message}
					</h4>
				</div>
				<div className="form-row">
					<div className="col-6">
						<label htmlFor="firstName" className="sr-only">First Name:</label>
						<input name="firstName" 
						className="form-control rounded shadow-pop-tl" 
						type="text" 
						placeholder="First name" 
						value={firstName} 
						onChange={(e)=> setFName(e.target.value)}
						required />
					</div>
					<div className="col-6">
						<label htmlFor="lastName" className="sr-only">Last Name:</label>
						<input name="lastName" 
						className="form-control rounded shadow-pop-tl" 
						type="text" 
						placeholder="Last name" 
						value={lastName} 
						onChange={(e) => setLName(e.target.value)}
						required />
					</div>
				</div>
				<div className="form-row mt-2">
					<div className="col-md-12">
						<label htmlFor="email" className="sr-only">Email:</label>
						<input name="email" 
						className="form-control rounded shadow-pop-tl" 
						type="text" 
						placeholder="Email" 
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required />
					</div>
				</div>
				<div className="form-row mt-2">
					<div className="col-md-12">
						<label htmlFor="password_one" className="sr-only">Password:</label>
						<input name="password_one" 
						className="form-control rounded shadow-pop-tl" 
						type="password" 
						placeholder="Password" 
						value={password}
						onChange={(e) => {
							setPassword(e.target.value)
							setPasswordOne(e.target.value)
						}}
						required />
					</div>
				</div>
				<div className="form-row">
					<div className="col-md-12">
						<label htmlFor="password_two" className="sr-only">Confirm Password:</label>
						<input name="password_two " 
						className="form-control rounded shadow-pop-tl" 
						type="password" 
						onChange={(e) => {
							setPasswordTwo(e.target.value)
						}}
						placeholder="Repeat Password" />
					</div>
				</div>
				<button type="submit" 
				className="btn btn-lg btn-success btn-block shadow-pop-tl"
				>Register</button>
			</form>
		);
	}

export default SignUp
