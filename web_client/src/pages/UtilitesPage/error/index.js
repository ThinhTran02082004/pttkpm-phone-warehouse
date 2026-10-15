import Page1 from '../../../components/layouts/Page1'
import SideNavbar from '../../../components/layouts/sideBar'

function ErrorPage() {
  return (
    <Page1 sidebar={<SideNavbar/>}>
      <h1 className='m-3'>404 - Không tồn tại</h1>
    </Page1>
  )
}

export default ErrorPage