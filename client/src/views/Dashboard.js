import React, { Component } from 'react';
import { client } from '../utils';

class Dashboard extends Component {
  constructor(props) {
		super(props)
		this.state = {
			fields: { message: '' }
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();    
		client.getProtectedRoute()
    .then((response) => {
      this.setState({
        fields: {
          message: response.message
        }
      })
    })
    .catch((error) => {
      console.log('error');
      console.log(error);
    })
	}
	
  render() {
	const { message } = this.state.fields;
  client.fetchUsers();
    return (
      <div className="container-fluid">
        <form className="form-signin" onSubmit={this.handleSubmit}>
          <button type="submit" className="btn btn-lg btn-success btn-block shadow-pop-tl">Get Protected Route</button>
          <div className="form-group mt-3">
            <div className={message ? "alert alert-success alert-dismissible fade show shadow-pop-tl" : ""} role="alert">
              <h4 className="alert-heading">
              {message}
              </h4>
            </div>
          </div>
        </form>
        </div>
    );
  }
}

export default Dashboard;
