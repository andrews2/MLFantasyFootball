/*
* Created by Andrew Shipman
* 4/12/2023
*/
import { Grid, Drawer, Button, Menu, MenuProps } from 'antd';
import { useState, useCallback, useMemo } from 'react';

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

    const onDrawerClose = useCallback(() => {
      setShowDrawer(false);
    }, []);
  
    const onButtonClick = useCallback(() => {
      setShowDrawer(true);
    }, []);

    const menuItems = useMemo(() => {
        return [
            getItem('Home', '1'),
            getItem('Player Database', 2)
        ]
    }, [])

    return (
        <>
            <Drawer open={showDrawer} onClose={onDrawerClose} placement="left" bodyStyle={{padding: '0px'}}>
                <Menu theme="dark" items={menuItems}/>
            </Drawer>
            <Button onClick={onButtonClick}>open</Button>
            {children}
        </>
    )
}

export default Layout;