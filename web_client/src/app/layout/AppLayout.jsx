import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const savedValue = window.localStorage.getItem('pttkpm_sidebar_collapsed');
    return savedValue === 'true';
  });

  useEffect(() => {
    window.localStorage.setItem('pttkpm_sidebar_collapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  function handleToggleSidebar() {
    setIsSidebarCollapsed((current) => !current);
  }

  return (
    <div className={isSidebarCollapsed ? 'shell-layout shell-layout--collapsed' : 'shell-layout'}>
      <Sidebar collapsed={isSidebarCollapsed} />
      <div className="shell-main">
        <Topbar
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
