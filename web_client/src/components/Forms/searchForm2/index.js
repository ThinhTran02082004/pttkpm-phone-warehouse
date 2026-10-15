import { forwardRef } from 'react';
import { faArrowRotateRight, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Form, FormControl, FormSelect } from 'react-bootstrap';

import IconBtn from '../../buttons/iconBtn';
import styles from './style.module.css'

const SearchForm2 = forwardRef(function (prop = {}, ref) {
  return (
    <Form ref={ref} className={["d-flex align-items-center gap-3"].join(" ")} {...prop}>
      {/* <div> */}
      <FormSelect className='w-auto'>
        <option>test1</option>
        <option>test2</option>
        <option>test3</option>
        <option>test4</option>
      </FormSelect>
      <FormControl className='w-auto d-block' type='text' placeholder='Tìm kiếm' />

      <IconBtn className="w-auto btn-success" icon={faArrowRotateRight} title={"Làm mới"} />

    </Form>

  )
})

export default SearchForm2;