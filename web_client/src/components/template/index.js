import { forwardRef } from 'react';
import styles from './style.module.css'

const Template = forwardRef(function ({ children }, ref) {
  return (
    <div ref={ref}>
      {children}
    </div>
  )
})

export default Template;