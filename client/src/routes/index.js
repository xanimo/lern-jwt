import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './error-boundary';
import Navbar from '../components/Navbar';
import client from '../utils/client';
import { Public } from "./public";
import { Protected } from "./protected";

const BrowserRoutes = () => {
  const currentUser = client.getCurrentUser();
  return (
    <ErrorBoundary>
      <Router>
        <Navbar currentUser={currentUser} />
        {currentUser ? <Protected /> : <Public />}
      </Router>
    </ErrorBoundary>
  )
};

export default BrowserRoutes
