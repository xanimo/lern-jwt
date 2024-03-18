import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) { return { hasError: true };  }
    componentDidCatch(error, errorInfo) { 
        console.log(error)
        console.log(errorInfo); 
    }
    render() {
        if (this.state.hasError) {  return <h1>error</h1>; }
        return this.props.children; 
    }
}
