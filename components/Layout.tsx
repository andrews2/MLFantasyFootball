/*
* Created by Andrew Shipman
* 4/12/2023
*
* creates global layout used for all pages
*/
import { Menu, MenuProps, Layout as AntLayout, Button, Divider } from 'antd';
import React, { useState, useCallback, useMemo } from 'react';
import { DatabaseFilled, FileAddFilled, HomeFilled, MenuFoldOutlined, MenuUnfoldOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { MenuInfo } from 'rc-menu/lib/interface';
import AuthModals from './AuthModals';
import { signOut } from "next-auth/react";
import { useUserSession } from '@/hooks/useUserSession';


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
	const [logInOpen, setLogInOpen] = useState(false);
	const [signUpOpen, setSignUpOpen] = useState(false);
	const { session } = useUserSession();

	const router = useRouter();
  
	const onButtonClick = useCallback(() => {
		setCollapsed(!collapsed);
	}, [collapsed]);

	const menuItems = useMemo(() => {
		const items = [getItem('Home', '1', <HomeFilled />),];
		if (session) {
			items.push(getItem('Player Database', '2', <DatabaseFilled />));
			items.push(getItem('Custom Dataset', '3', <FileAddFilled />));
		}
		if (session?.user.role === 'admin') {
			items.push(getItem('Admin', '9', <SolutionOutlined />));
		}
        
		return items;
	}, [session]);

	const selectedPage = useMemo(() => {
		const route = router.asPath;
		switch (true) {
		case route.startsWith('/PlayerDatabase'):
			return ['2'];
		case route.startsWith('/CustomDataset'):
			return ['3'];
		case route.startsWith('/Admin'):
			return ['9'];
		case route.startsWith('/'):
			return ['1'];
		default:
			return [];
		}
	}, [router.asPath]);

	const onMenuItemClick = useCallback((e: MenuInfo) => {
		switch(e.key) {
		case '1':
			router.push('/');
			break;
		case '2':
			router.push('/PlayerDatabase');
			break;
		case '3':
			router.push('/CustomDataset');
			break;
		case '9':
			router.push('/Admin');
			break;
		}
	}, [router]);

	//callbacks for auth buttons
	const onLogInClick = useCallback(() => {
		setLogInOpen(true);
	}, []);

	const onSignUpClick = useCallback(() => {
		setSignUpOpen(true);
	}, []);

	const onLogInCancel = useCallback(() => {
		setLogInOpen(false);
	}, []);

	const onSignUpCancel = useCallback(() => {
		setSignUpOpen(false);
	}, []);

	const renderHeaderAuth = useMemo(() => {
		if (session) {
			return (
				<div style={{ float: 'right' }}>
					<Button icon={<UserOutlined />} type="link" >{session.user?.name}</Button>
					<Divider type="vertical" />
					<Button type="link" onClick={() => signOut({ redirect: false })}>Sign Out</Button>
				</div>
			);
		} else {
			return (
				<div style={{ float: 'right' }}>
					<Button type="link" onClick={onLogInClick}>Log In</Button>
					<Divider type="vertical" />
					<Button type="link" onClick={onSignUpClick}>Sign Up</Button>
				</div>
			);
		}
        
	}, [onLogInClick, onSignUpClick, session]);

	return (
		<AntLayout>
			<Sider trigger={null} collapsible collapsed={collapsed} style={{ height: '100vh', position: 'sticky', top: 0, zIndex: 10 }}>
				<div className='logo'>
				</div>
				<Menu theme="dark" items={menuItems} mode="inline" defaultSelectedKeys={selectedPage} onClick={onMenuItemClick}/>
			</Sider>
			<AntLayout className='site-layout'>
				<Header style={{ padding: 0, background: '#ffffff', position: 'sticky', top: 0, zIndex: 10 }}>
					{React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
						className: 'trigger',
						onClick: onButtonClick,
					})}
					{renderHeaderAuth}
				</Header>
				<Content
					style={{
						margin: '24px 16px',
						padding: 24,
						minHeight: '80vh',
						background: '#ffffff',
					}}
				>
					<AuthModals logInOpen={logInOpen} signUpOpen={signUpOpen} onLogInCancel={onLogInCancel} onSignUpCancel={onSignUpCancel} />
					{children} 
				</Content>
			</AntLayout>
		</AntLayout>
	);
};

export default Layout;