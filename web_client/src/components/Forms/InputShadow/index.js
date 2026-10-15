import React, { forwardRef } from 'react'
import { FormControl } from 'react-bootstrap'

import styles from './style.module.css'

const InputShadow = forwardRef(function ({ as: As = "input", className, children, ...prop }, ref) {
  return (
    <As ref={ref} {...prop} className={[className, "form-control shadow-sm"].join(" ")} >
      {children}
    </As>
  )
})

export default InputShadow