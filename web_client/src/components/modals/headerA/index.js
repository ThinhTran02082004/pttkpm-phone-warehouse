import { Modal } from 'react-bootstrap';

import styles from './style.module.css'

const HeaderModalA = function ({ title, ...prop }) {
  return (
    <Modal.Header {...prop} className={[styles.bgColor, 'text-light'].join(" ")}>
      <Modal.Title className='text-center w-100 fw-bold fs-3'>
        {title}
      </Modal.Title>
    </Modal.Header>
  )
}

export default HeaderModalA;