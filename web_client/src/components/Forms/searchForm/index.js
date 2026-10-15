import { forwardRef } from 'react';
import { faArrowRotateRight, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Form, FormControl } from 'react-bootstrap';

import IconBtn from '../../buttons/iconBtn';

import styles from './style.module.css'

const SearchForm = forwardRef(function (prop = {}, ref) {
  return (
    <Form ref={ref} className={["d-flex align-items-center gap-3"].join(" ")} {...prop}>
      <FormControl className='w-auto' type='text' placeholder='Tìm kiếm' />
      <IconBtn className='w-auto btn-primary' icon={faMagnifyingGlass} title={"Tìm kiếm"} />
      <IconBtn className='w-auto btn-success' icon={faArrowRotateRight} title={"Làm mới"} />
    </Form>
  )
})

export default SearchForm;