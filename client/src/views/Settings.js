import React, { Component } from 'react';
import { Tabs, Tab } from "react-bootstrap";
import { client } from "../utils";
import ResetPassword from './ResetPassword';
import SearchBar from '../components/SearchBar';
import './LogIn.css';

class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            fields: { message: '' }
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
        const currentUser = client.getCurrentUser();
        return (
            <div className="container-fluid form-group"
                onChange={this.onInputChange.bind(this)}
                onSubmit={this.onFormSubmit.bind(this)}>
                <Tabs className="mb-3">
                    <Tab eventKey="profile" title="Profile">
                        <div className="alert-success alert-dismissible fade show rounded shadow-pop-tl">
                            <table className="table table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th scope="col">Key</th>
                                        <th scope="col">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(currentUser.sub).map((k, i) => {
                                        if (Object.hasOwn(currentUser.sub[k], 'sin')) {
                                            return Object.keys(currentUser.sub[k]).map((value, index) => {
                                                return <tr key={index}><td>{value}</td><td>{currentUser.sub[k][value]}</td></tr>
                                            })
                                        } else {
                                            return <tr key={i}><td>{k}</td><td>{currentUser.sub[k]}</td></tr>
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Tab>
                    <Tab eventKey="reset-password" title="Reset Password">
                        <div className="container-fluid">
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
