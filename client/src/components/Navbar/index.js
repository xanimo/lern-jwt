/**
*
* Navbar
*
*/

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = (props) => {
	return (
		<nav className='navbar fixed-top navbar-expand-md navbar-light bg-light'>
			<Link className="navbar-brand " to="/">mern-jwt</Link>
			  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
			    <span className="navbar-toggler-icon"></span>
			  </button>
			<div className="collapse navbar-collapse" id="navbarNav">
			{props.currentUser
				? (
					<ul className="navbar-nav">
						<li className="nav-item">
							<Link className="nav-link" to="/settings">Settings</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/logout">Log Out</Link>
						</li>
					</ul>
				)
				: (					
					<ul className="navbar-nav">
						<li className="nav-item">
							<Link className="nav-link" to="/login">Log In</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/signup">Sign Up</Link>
						</li>
					</ul>
				)
			}
			</div>
		</nav>
	);
};

export default Navbar;
