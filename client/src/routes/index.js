import React, { Component } from 'react';
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import {
  LogIn,
  LogOut,
  SignUp,
  Admin,
  Home
} from '../views';
import { Navbar } from '../modules';
import client from '../utils/client';
import config from '../utils/path';

class Routes extends Component {
  state = { currentUser: client.getCurrentUser() }

  onLoginSuccess(user) {
    this.setState({ currentUser: client.getCurrentUser() })
  }

  logOut() {
    client.logOut()
    this.setState({ currentUser: null })
  }
  
  render() {
    const { currentUser } = this.state
    // console.log(currentUser)
    // console.log(config())
    return (
      <div className="container">
        <Navbar currentUser={currentUser} />

        <Switch>
        
          <Route path="/login" render={(props) => {
            return <LogIn {...props} onLoginSuccess={this.onLoginSuccess.bind(this)} />
          }} />

          <Route path="/logout" render={(props) => {
            return <LogOut onLogOut={this.logOut.bind(this)} />
          }} />

          {/* the sign up component takes an 'onSignUpSuccess' prop which will perform the same thing as onLoginSuccess: set the state to contain the currentUser */}
          <Route path="/signup" render={(props) => {
            return <SignUp {...props} onSignUpSuccess={this.onLoginSuccess.bind(this)} />
          }} />

          <Route path="/admin" render={() => {
            return currentUser
              ? <Admin />
              : <Redirect to="/login" />
          }} />

          <Route path="/" component={Home} />

        </Switch>
      </div>
    )
  }  
}

export default Routes