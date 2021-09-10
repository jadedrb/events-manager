import React, { Component } from 'react'

import ReactDOM from 'react-dom';

const portalRoot = document.getElementById('portal');
const element = document.createElement('div')

class Modal extends Component {
    
    componentDidMount() {
        portalRoot.appendChild(element)
    }

    componentWillUnmount() {
        portalRoot.removeChild(element)
    }
    
    render() { 
        return ReactDOM.createPortal(this.props.children, element)
    }
}
 
export default Modal;