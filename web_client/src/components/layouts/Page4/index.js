import { Button, Form, FormControl, FormGroup, FormLabel, FormSelect, InputGroup } from 'react-bootstrap'

import ContentA from '../blockContent'
import Page1 from '../Page1'

import style from './style.module.css'

function Page4({ sidebar, tableTop, table, tableForm, toolBtn, table2, count, rightTopForm, rightBottomForm }) {
  const width = 75;
  const height = 55;
  const width2 = 60;

  return (
    <Page1 sidebar={sidebar}>
      <div className='w-100 h-100 d-flex p-3 gap-2'>
        <div className='h-100 d-flex flex-column' style={{ width: width + "%" }}>
          <div className='d-flex gap-2' style={{ height: height + "%" }}>
            <div className='d-flex flex-column gap-2' style={{ width: width2 + "%" }}>
              <Form>
                {tableTop}
              </Form>

              <ContentA className='h-100 overflow-auto bg-light'>
                {table}
              </ContentA>
            </div>

            <ContentA className="d-flex flex-grow-1" style={{ width: 100 - width2 + "%" }}>
              {tableForm}
            </ContentA>
          </div>

          <div className='d-flex flex-column gap-1' style={{ height: 100 - height + "%" }}>
            <div className='h-25 d-flex justify-content-between gap-5 w-100 px-1'>
              {toolBtn}
            </div>

            <ContentA className='w-100 h-100' >
              {table2}
            </ContentA>

            <p className='text-end fw-bold mx-3 fs-5'>Tổng số: <span className='sp-count'>{count}</span> chiếc</p>
          </div>
        </div>

        <ContentA className="d-flex justify-content-between flex-column p-3" style={{ width: 100 - width + "%" }}>
          <Form className='d-flex flex-column gap-5'>
            {rightTopForm}
          </Form>

          <div className='px-auto text-center'>
            {rightBottomForm}
          </div>
        </ContentA>
      </div>
    </Page1>
  )
}

export default Page4