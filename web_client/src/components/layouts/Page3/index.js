import { useState } from 'react'
import { Form } from 'react-bootstrap'

import Page1 from '../Page1'
import SideNavbar from '../sideBar'
import ContentA from '../blockContent'
import FlexForm from '../../Forms/FlexForm'

import style from './style.module.css'

function Page3({ sidebar, tools, rightForm, leftForm, table }) {
  const height = 15;
  const width = 25;
  return (
    <Page1 sidebar={sidebar}>
      <div className='d-flex gap-3 flex-column w-100 h-100 p-3'>
        <ContentA className="d-flex justify-content-between px-3" style={{ height: height + "%" }}>
          <div className='d-flex gap-2' >
            {tools}
          </div>

          <FlexForm>
            {rightForm}
          </FlexForm>
        </ContentA>

        <div className='d-flex gap-3' style={{ height: 100 - height + "%" }} >
          <ContentA className="d-flex flex-column justify-content-around p-4" As={Form} style={{ width: width + "%" }}>
            {leftForm}
          </ContentA>

          <ContentA style={{ width: 100 - width + "%" }}>
            {table}
          </ContentA>
        </div>
      </div>
    </Page1>
  )
}

export default Page3