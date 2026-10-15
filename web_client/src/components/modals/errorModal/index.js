import { forwardRef } from 'react';
import { Button, Modal } from 'react-bootstrap';

import styles from './style.module.css'

const ErrorModal = function ({ children, show, onHide, ...prop }) {
  return (
    <Modal {...prop} show={show} backdrop="static">
      <Modal.Header className='bg-danger text-danger'>
        <Modal.Title className='fw-bold text-light text-center w-100 m-0'>LỖI</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {children}
      </Modal.Body>

      <Modal.Footer>
        <Button variant='danger close-btn' onClick={onHide}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ErrorModal;