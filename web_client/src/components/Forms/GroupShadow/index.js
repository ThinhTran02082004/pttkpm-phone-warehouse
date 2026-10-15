import { forwardRef } from "react";
import { InputGroup } from "react-bootstrap";

const GroupShadow = forwardRef(function GroupShadow({ children, className, ...prop }, ref) {
  return (
    <InputGroup ref={ref} {...prop} className={[className, "shadow-sm"].join(" ")}>
      {children}
    </InputGroup>
  )
})

export default GroupShadow