import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './style.module.css'

const ThuocTinhBtn = forwardRef(function ({ icon, title, className, ...prop }, ref) {
  return (
    <button  {...prop} ref={ref} className={[className, "d-flex border border-dark border-3 gap-3 align-items-center rounded-3"].join(" ")}>
      {!!icon && <FontAwesomeIcon icon={icon} width={"150px"} size='5x' />}
      <h1> {title} </h1>
    </button>
  )
})

export default ThuocTinhBtn;