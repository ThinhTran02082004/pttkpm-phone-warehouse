import './style.module.css'
import {Form} from "react-bootstrap";

const tableHD = [
  {key: "Ngày", value: ""},
  {key: "Vốn", value: ""},
  {key: "Doanh thu", value: ""},
  {key: "Lợi nhuận", value: ""},
]
const Layout2 = function ({leftPart, rightPart}) {
  return (
    <div className="w-100 _h-100 d-flex p-3 gap-3 overflow-hidden">
      <Form className="h-100 _w-25 border p-3 d-flex flex-column gap-5 ">
        {leftPart}
      </Form>

      <div className="d-flex flex-column gap-2 h-100 _w-75 overflow-hidden">
        {rightPart}
      </div>
    </div>
  )
}

export default Layout2;