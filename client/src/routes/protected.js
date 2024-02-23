import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Settings } from "../views";
import { client } from "../utils";
import history from "../utils/history";
import { NotFound } from '../views';

export const Protected = () => {
    const logOut = () => {
        client.logOut();
        history.push('/');
        window.location.reload('/');
    }
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" Component={logOut} />
            <Route path='*' element={<NotFound />}/>
        </Routes>
    );
};
