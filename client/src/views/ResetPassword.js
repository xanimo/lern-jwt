import React, { Component } from "react";
import { client } from '../utils';

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

export default class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: { password_one: '', password_two: '', id: this.props.currentUser.sub.id, error: '', message: '' }
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
    const errors = validate(this.state.fields);
    if (Object.keys(errors).length > 0) {
      {
        Object.keys(errors).map((fieldname) => {
          this.setState({
            fields: {
              error: errors[fieldname]
            }
          });
        })
      }
      return errors;
    }
    client.update(this.state.fields)
      .then((response) => {
        console.log('response', response);
        console.log('response', response.success);
        const token = response.token;
        if (token) {
          // sets token as an included header for all subsequent api requests
          client.defaults.headers.common.token = client.setToken(token);
          const decodedToken = client.getCurrentUser();
          localStorage.setItem('user', JSON.stringify(decodedToken.sub));
        }
        return response.success === false ? (
          this.setState({
            fields: {
              email: '',
              password: '',
              error: response.message
            }
          })
        ) : (
          this.setState({
            fields: {
              email: '',
              password: '',
              currentUser: client.getCurrentUser().sub.id,
              message: 'Success! Your password has been updated and your authentication token has been refreshed.'
            }
          })
        )
      })
      .catch((error) => {
        console.log(error);
      })
    // const encoded = Buffer.from(client.JsonToArray(this.state.fields));
    // console.log(encoded);
    // const encrypted = client.encrypt(Buffer.from(process.env.PRIVATE_KEY_HEX, 'hex'), encoded);
    // console.log(encrypted);
    // client.patch(`api/users/${this.state.fields.currentUser}`, encrypted)
    //   .then((response) => {
    //     const token = response.data.token;
    //     if (token) {
    //       // sets token as an included header for all subsequent api requests
    //       client.defaults.headers.common.token = client.setToken(token);
    //       const decodedToken = client.getCurrentUser();
    //       localStorage.setItem('user', decodedToken.sub.id);
    //     }
    //     return response.data.success === false ? (
    //       this.setState({
    //         fields: {
    //           email: '',
    //           password: '',
    //           error: response.data.message
    //         }
    //       })
    //     ) : (
    //       this.setState({
    //         fields: {
    //           email: '',
    //           password: '',
    //           currentUser: client.getCurrentUser().sub.id,
    //           message: 'Success! Your password has been updated and your authentication token has been refreshed.'
    //         }
    //       })
    //     )
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  render() {
    const { id, password_one, password_two, error, message } = this.state.fields;
    return (
      <form
        onChange={this.onInputChange.bind(this)}
        onSubmit={this.onFormSubmit.bind(this)}>
        <div className={error ? "alert alert-danger alert-dismissible fade show shadow-pop-tl" : message ? "alert alert-success alert-dismissible fade show shadow-pop-tl" : ""} role="alert">
          <h4 className="alert-heading">
            {error}
            {message}
          </h4>
        </div>
        <div className="form-group rounded shadow-pop-tl">
          <label htmlFor="password_two" className="sr-only">New Password:</label>
          <input className="form-control rounded" name="password_one" placeholder="New Password" defaultValue={password_one} onChange={this.onInputChange.bind(this)} type="password" required />
        </div>

        <div className="form-group rounded shadow-pop-tl">
          <label htmlFor="password_two" className="sr-only">Confirm New Password:</label>
          <input className="form-control rounded" name="password_two" placeholder="Confirm New Password" defaultValue={password_two} onChange={this.onInputChange.bind(this)} type="password" required />
        </div>

        <button action="submit" className="btn btn-lg btn-success btn-block shadow-pop-tl">Change Password</button>
      </form>
    );
  }
}
