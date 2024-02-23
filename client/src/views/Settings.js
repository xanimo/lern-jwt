import React, { Component, useState } from 'react';
import { Tabs, Tab } from "react-bootstrap";
import { client } from "../utils";
import history from "history/browser";
import ResetPassword from './ResetPassword';
import SearchBar from '../components/SearchBar';
import './LogIn.css';

class Settings extends Component {
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
    };

    render() {
        const { email, password, message } = this.state.fields;
        const currentUser = client.getCurrentUser();
        const users = client.getUsers();
        return (
            <div className="container form-group"
                onChange={this.onInputChange.bind(this)}
                onSubmit={this.onFormSubmit.bind(this)}>
                <Tabs className="mb-3 p-1 fade show shadow-pop-tl container">
                    <Tab className="login text-center" eventKey="profile" title="Profile">
                        <div className="alert-success alert-dismissible fade show shadow-pop-tl">
                        <table className="table table-striped table-sm">
                            <thead>
                                <tr>
                                    <th scope="col">Key</th>
                                    <th scope="col">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(currentUser).map((k, i) => {
                                    if (Object.hasOwn(currentUser[k], '_id')) {
                                        return Object.keys(currentUser[k]).map((value, index) => {
                                            return <tr key={index}><td>{value}</td><td>{currentUser[k][value]}</td></tr>
                                        })
                                    } else {
                                        return <tr key={i}><td>{k}</td><td>{currentUser[k]}</td></tr>
                                    }
                                })}
                            </tbody>
                        </table>
                        </div>
                    </Tab>
                    <Tab eventKey="reset-password" title="Reset Password">
                        <div className="container">
                            <ResetPassword currentUser={currentUser} />
                        </div>
                    </Tab>
                    <Tab eventKey="users" title="Users">
                        <div className="container-fluid">
                            <SearchBar />
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default Settings;
