import {forwardRef}      from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

import styles from './style.module.css'

const ToolBtn = forwardRef(function ({as: As = "button", className, icon, color, title, ...prop}, ref) {
  return (
    <As {...prop} type="button" ref={ref} className={[styles.button, "btn d-grid gap-2 text-center align-self-center", className].join(" ")}>
      <FontAwesomeIcon icon={icon} className='mx-auto' color={color} size='3x'/>
      <p className={["m-0 fw-bold "].join(" ")}> {title?.toUpperCase()} </p>
    </As>
  )
})

export default ToolBtn