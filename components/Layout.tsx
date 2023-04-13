/*
* Created by Andrew Shipman
* 4/12/2023
*/
import { Menu, MenuProps, Layout as AntLayout } from 'antd';
import React, { useState, useCallback, useMemo } from 'react';
import { DatabaseFilled, HomeFilled, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { MenuInfo } from 'rc-menu/lib/interface';

const { Header, Sider, Content } = AntLayout;

type LayoutProps = {
    children: React.ReactElement;
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

const Layout = ({ children }: LayoutProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
  
    const onButtonClick = useCallback(() => {
      setCollapsed(!collapsed)
    }, [collapsed]);

    const menuItems = useMemo(() => {
        return [
            getItem('Home', '1', <HomeFilled />),
            getItem('Player Database', '2', <DatabaseFilled />)
        ]
    }, [])

    const selectedPage = useMemo(() => {
        const route = router.asPath;
        switch (route) {
            case '/':
                return ['1'];
            case '/PlayerDatabase':
                return ['2']
            default:
                return [];
        }
    }, [router.asPath])

    const onMenuItemClick = useCallback((e: MenuInfo) => {
        switch(e.key) {
            case '1':
                router.push('/');
                break;
            case '2':
                router.push('/PlayerDatabase');
                break;
        }
    }, [router])

    return (
        <AntLayout>
            <Sider trigger={null} collapsible collapsed={collapsed} style={{ height: '100vh', position: 'sticky', top: 0, zIndex: 1 }}>
                <div className='logo' />
                <Menu theme="dark" items={menuItems} mode="inline" defaultSelectedKeys={selectedPage} onClick={onMenuItemClick}/>
            </Sider>
            <AntLayout className='site-layout'>
                <Header style={{ padding: 0, background: '#ffffff', position: 'sticky', top: 0, zIndex: 1 }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: onButtonClick,
                    })}
                </Header>
                <Content
                        style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: '80vh',
                        background: '#ffffff',
                    }}
                >
                    {children} 
                </Content>
            </AntLayout>
        </AntLayout>
    )
}

export default Layout;