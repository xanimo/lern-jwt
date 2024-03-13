import React, { useState } from 'react';
import { client } from '../utils';
import history from "history/browser";

const SignUp = (props) => {
	const [id, setId] = useState("");
	const [password, setPassword] = useState("");
	const [password_one, setPasswordOne] = useState("");
	const [password_two, setPasswordTwo] = useState("");
	const [message, setMessage] = useState("");

	const onFormSubmit = (e) => {
		e.preventDefault();
		setId(process.env.ID);
		console.log(id);
		const errors = validate({ id, password_one, password_two });
		if (Object.keys(errors).length > 0) {
			{
				Object.keys(errors).map((fieldname) => {
					setMessage(errors[fieldname]);
				})
			}
			return errors;
		};
		client.signUp({ id, password })
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
		const fields = ['password_one', 'password_two'];
		fields.forEach((f) => {
			if (!(f in props)) {
				errors[f] = `${f} is required`;
			}
		});

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
