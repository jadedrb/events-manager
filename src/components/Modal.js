import { useEffect } from 'react'

import ReactDOM from 'react-dom';

const portalRoot = document.getElementById('portal');
const element = document.createElement('div')

const Modal = ({ children }) => {

    useEffect(() => {
        portalRoot.appendChild(element)
        return () => portalRoot.removeChild(element)
    }, [])

    return ReactDOM.createPortal(children, element)
}

export default Modal;