import {Button, Modal, ModalFooter, ModalHeader, ModalTitle} from 'react-bootstrap';

function AlertModal({show, message, onHide}) {
  return (
    <Modal show={show}>
      <ModalHeader>
        <ModalTitle>{message}</ModalTitle>
      </ModalHeader>

      <ModalFooter>
        <Button className="btn-danger px-2" onClick={e => {
          if (typeof onHide === 'function') onHide();
        }}> OK </Button>
      </ModalFooter>
    </Modal>
  )
}

export default AlertModal;