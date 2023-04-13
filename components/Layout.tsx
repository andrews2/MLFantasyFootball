/*
* Created by Andrew Shipman
* 4/12/2023
*/
import { Row, Col, Drawer, Button, Menu, MenuProps } from 'antd';
import { useState, useCallback, useMemo } from 'react';
import { DatabaseFilled, HomeFilled, MenuOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

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
    const [showDrawer, setShowDrawer] = useState(false);
    const router = useRouter();

    const onDrawerClose = useCallback(() => {
      setShowDrawer(false);
    }, []);
  
    const onButtonClick = useCallback(() => {
      setShowDrawer(true);
    }, []);

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
    }, [])

    const onMenuItemClick = useCallback((e: any) => {
        switch(e.key) {
            case '1':
                router.push('/');
                break;
            case '2':
                router.push('/PlayerDatabase');
                break;
        }
        setShowDrawer(false);
    }, [])

    return (
        <>
            <Drawer 
                open={showDrawer} 
                onClose={onDrawerClose} 
                closable={false} 
                placement="left" 
                style={{background: '#001529'}} 
                bodyStyle={{paddingLeft: '0px', paddingRight: '0px'}}
            >
                <Menu theme="dark" items={menuItems} defaultSelectedKeys={selectedPage} onClick={onMenuItemClick}/>
            </Drawer>
            <div style={{background: '#001529', width: '100%', position:'sticky', top: '0px'}}>
                <Button type="ghost" icon={<MenuOutlined style={{color: '#ffffff'}}/>} onClick={onButtonClick} size="large" />
            </div>
            {children}
        </>
    )
}

export default Layout;