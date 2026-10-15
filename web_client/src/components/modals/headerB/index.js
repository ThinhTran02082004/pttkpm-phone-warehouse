import {Modal} from 'react-bootstrap';

const HeaderModalB = function ({children, className, ...prop}) {
  return (
    <Modal.Header className={[className, 'bg-primary text-light'].join(' ')} {...prop}>
      {children}
    </Modal.Header>
  )
}

export default HeaderModalB;