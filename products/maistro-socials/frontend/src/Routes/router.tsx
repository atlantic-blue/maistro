/* eslint-disable */
import React, { useState } from 'react';
import { Route, Routes as ReactRoutes, useLocation, useNavigate } from 'react-router';
import { BarChartIcon, FileTextIcon, HomeIcon, LayoutIcon } from 'lucide-react';
import { GearIcon } from '@radix-ui/react-icons';
import { IconLogoSimple, Layout, NavItem } from '@maistro/ui';

enum Routes {
  HOME = '/',
  SOCIALS = '/socials',
  TEMPLATES = '/templates',
  ANALYTICS = '/analytics',
  SETTINGS = '/settings',
}

const routesNavigation: NavItem[] = [
  {
    name: 'Dashboard',
    path: Routes.HOME,
    icon: <HomeIcon />,
  },
  {
    name: 'My Socials',
    path: Routes.SOCIALS,
    icon: <LayoutIcon />,
  },
  {
    name: 'Templates',
    path: Routes.TEMPLATES,
    icon: <FileTextIcon />,
  },
  {
    name: 'Analytics',
    path: Routes.ANALYTICS,
    icon: <BarChartIcon />,
  },
  {
    name: 'Settings',
    path: Routes.SETTINGS,
    icon: <GearIcon />,
  },
];

// Mock user data
const currentUser = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  avatar: undefined, // Will use fallback
};

function getPageTitle(path: string): string {
  switch (path) {
    case Routes.HOME:
      return 'Dashboard';
    case Routes.SOCIALS:
      return 'My Socials';
    case Routes.TEMPLATES:
      return 'Templates';
    case Routes.ANALYTICS:
      return 'Analytics';
    case Routes.SETTINGS:
      return 'Settings';
    default:
      return 'Dashboard';
  }
}

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState(getPageTitle(location.pathname));

  const handleNavigate = (path: string) => {
    navigate(path);
    setPageTitle(getPageTitle(path));
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <Layout
      productName="Socials"
      accentColor="purple"
      navigation={routesNavigation}
      logo={<IconLogoSimple />}
      currentPath={location.pathname}
      user={currentUser}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      headerTitle={pageTitle}
      notificationCount={3}
      helpUrl="https://help.maistro.websites"
    >
      <ReactRoutes>
        <Route path="/" element={<div>Hello World!</div>} />
        <Route path="/" element={<div>Hello World!</div>} />
        <Route path="/" element={<div>Hello World!</div>} />
        <Route path="/" element={<div>Hello World!</div>} />
      </ReactRoutes>
    </Layout>
  );
};

export default AppRoutes;
