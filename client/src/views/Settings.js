import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from "react-bootstrap";
import { client } from "../utils";
import ResetPassword from './ResetPassword';
import SearchBar from '../components/SearchBar';
import './LogIn.css';

const Settings = () => {
    const [currentUser, setUser] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
        try {
            const user = await client.getCurrentUser();
            setUser(user);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
        }
    
        fetchData();
    }, []);

    if (loading) {
    return <div>Loading...</div>;
    }

    if (error) {
    return <div>Error: {error.message}</div>;
    }
      
    return (
        <div className="container-fluid form-group">
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

export default Settings;
