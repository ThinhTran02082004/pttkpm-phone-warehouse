import ContentA from '../blockContent'
import SideNavbar from '../sideBar'

import style from './style.module.css'

function Page2({ sidebar, tools, rightSec, dataTable }) {
  const sidebarWidth = 20, toolbarHeight = 15

  return (
    <main className='overflow-hidden vh-100'>
      <div className='d-flex h-100'>
        <section className='h-100' style={{ width: sidebarWidth + "%" }}>
          {sidebar}
        </section>

        <section className={['_bg-blue-0 h-100 d-flex flex-column p-3 gap-3'].join(" ")} style={{ width: (100 - sidebarWidth) + "%" }}>
          <ContentA className="d-flex justify-content-between px-2" style={{ height: toolbarHeight + "%" }}>
            <div className='d-flex gap-2'>
              {tools}
            </div>

            {rightSec}
          </ContentA>

          <ContentA style={{ height: 100 - toolbarHeight + "%" }}>
            {dataTable}
          </ContentA>
        </section>
      </div>
    </main>
  )
}

export default Page2