import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './style.module.css'

const IconBtn = forwardRef(function ({ as: As = "button", icon, title, className = "btn-outline-dark", ...prop }, ref) {
  return (
    <As {...prop} ref={ref} type="button" className={[className, "btn d-flex gap-2 align-items-center w-auto"].join(" ")} >
      {!!icon && <FontAwesomeIcon icon={icon} />}
      {!!title && <span> {title} </span>}
    </As>
  )
})

export default IconBtn;