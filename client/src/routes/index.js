import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './error-boundary';
import Navbar from '../components/Navbar';
import client from '../utils/client';
import { Public } from "./public";
import { Protected } from "./protected";

const BrowserRoutes = () => {
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
    <ErrorBoundary>
      <Router>
        <Navbar currentUser={currentUser} />
        {currentUser ? <Protected /> : <Public />}
      </Router>
    </ErrorBoundary>
  )
};

export default BrowserRoutes
