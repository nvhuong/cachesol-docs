import { Layout, Menu, Avatar, Dropdown, Button, Typography } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/stores/appStore';
import { useAuthStore } from '@/stores/authStore';
import { useMiniAppStore } from '@/stores/miniAppStore';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const MainLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { sidebarCollapsed, toggleSidebar, language, setLanguage } = useAppStore();
  const { user, logout } = useAuthStore();
  const menuItems = useMiniAppStore((state) => state.getMenuItems());

  // Build menu từ manifests
  const menuConfig = [
    {
      key: '/dashboard',
      icon: '🏠',
      label: t('shell.menu.dashboard'),
    },
    ...menuItems.map((item) => ({
      key: item.path || item.key,
      icon: item.icon,
      label: t(item.labelKey, item.key),
    })),
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    }
  };

  const handleLanguageChange = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        width={240}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            padding: sidebarCollapsed ? 0 : '0 16px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Text strong style={{ fontSize: 18, color: '#fff' }}>
            {sidebarCollapsed ? 'CS' : 'CacheSol'}
          </Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuConfig}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      
      <Layout style={{ marginLeft: sidebarCollapsed ? 80 : 240 }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={<GlobalOutlined />}
              onClick={handleLanguageChange}
            >
              {language.toUpperCase()}
            </Button>
            
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: 'Hồ sơ',
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Đăng xuất',
                    danger: true,
                  },
                ],
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} src={user?.avatarUrl} />
                <Text>{user?.name || 'User'}</Text>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content style={{ margin: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
