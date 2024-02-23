import React from 'react';
import { Routes, Route } from "react-router-dom";
import { LogIn, SignUp } from "../views/";
import { NotFound } from '../views';

export const Public = (props) => {
  const onLoginSuccess = () => {
    history.push('/admin');
    window.location.reload('/admin');
  }
  return (
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/login" Component={(props) => { return <LogIn {...props} onLoginSuccess={onLoginSuccess.bind(this)} />}} />
        <Route path="/signup" Component={(props) => { return <SignUp {...props} onSignUpSuccess={onLoginSuccess.bind(this)} />}} />
        <Route path='*' element={<NotFound />}/>
      </Routes>
  );
};
