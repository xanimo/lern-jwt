import React, { Component } from 'react';
import { client } from '../utils';
import { commands } from '../utils';
import Select from 'react-select';
import './dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fields: { command: client.getQuery(), args: '', message: '', data: '' }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    client.getProtectedRoute(
      this.state.fields.command, 
      this.state.fields.args
      )
      .then((response) => {
        this.setState({
          fields: {
            command: client.getQuery(),
            args: client.getArgs(),
            message: response.message,
            data: response.data
          }
        });
      })
      .catch((error) => {
        console.log('error');
        console.log(error);
      })
  }

	onInputChange = (e) => {
    e.preventDefault();
		this.setState({
			fields: {
				...this.state.fields,
				[e.target.name]: e.target.value
			}
		});
	};

  handleSelect = (option) => {
    this.setState({
      fields: {
        ...this.state.fields,
        command: option.value
      }
    })
  }

  render() {
    const { command, args, message, data } = this.state.fields;
    client.fetchUsers();
    const command_options = commands.map((value, index) => {
      return { value: value, label: value }
    })
    const customStyles = {
      menuPortal: provided => ({ ...provided, zIndex: 9999 }),
      menu: provided => ({ ...provided, zIndex: 9999 })
    }
    return (
      <div className="container-fluid">
        <form onSubmit={this.handleSubmit.bind(this)}
        onChange={this.onInputChange.bind(this)}>
        <div className="row">
        <div className="col">
          <div className='rounded shadow-pop-tl'>
          <Select id="command" 
          menuPortalTarget={document.body}
          menuPosition={'fixed'} 
          styles={customStyles} 
          options={command_options} 
          onChange={this.handleSelect.bind(this)} />
          </div>
        </div>
        <div className="col">
            <button type="submit" className="btn btn-md btn-success btn-block rounded shadow-pop-tl">Submit</button>
        </div>
      </div>
      <div className="row">
        <div className="col">
        <div className="mb-3 mt-3">
          <label htmlFor="args" className="sr-only">textarea</label>
          <textarea className="form-control rounded shadow-pop-tl" name="args" rows="3" onChange={this.onInputChange.bind(this)}></textarea>
        </div>
        </div>
      </div>
          <div className="form-group mt-3">
            <div className={message ? "alert alert-success alert-dismissible fade show shadow-pop-tl" : ""} role="alert">
              <h4 className="alert-heading">
                {message}
              </h4>
              <pre>{data}</pre>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Dashboard;
