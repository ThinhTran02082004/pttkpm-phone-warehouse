import { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

import styles from './style.module.css'

const FlexForm = forwardRef(function ({ className, children, ...prop }, ref) {
  return (
    <Form {...prop} ref={ref} className={[className, "d-flex align-items-center gap-3"].join(" ")} >
      {children}
    </Form>
  )
})

export default FlexForm;