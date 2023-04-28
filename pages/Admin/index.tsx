/*
* Created by Andrew Shipman
* 4/12/2023
*
* creates global layout used for all pages
*/

import PermissionDenied from "@/components/PermissionDenied";
import { apiRequest, API_ENDPOINTS } from "@/FrontendAPI/API";
import { useUserSession } from "@/hooks/useUserSession";
import { Table } from "antd";
import { useEffect, useMemo, useState } from "react";

const Admin = () => {
	const [users, setUsers] = useState<Record<string, string>[] | undefined>();
	const { session } = useUserSession();
	const [usersLoading, setUsersLoading] = useState(false);

	useEffect(() => {
		if (session?.user?.role == 'admin') {
			setUsersLoading(true);
			apiRequest(API_ENDPOINTS.ALL_USERS, data => {
				setUsers(data as Record<string, string>[]);
				setUsersLoading(false);
			});
		}
	}, [session?.user?.role]);

	const tableColumns = useMemo(() => {
		return [
			{
				title: 'ID',
				dataIndex: 'user_id',
				key: 'user_id',
			},
			{
				title: 'Username',
				dataIndex: 'username',
				key: 'username',
			},
			{
				title: 'Password',
				dataIndex: 'password',
				key: 'password',
			},
			{
				title: 'Email',
				dataIndex: 'email',
				key: 'email',
			},
			{
				title: 'Role',
				dataIndex: 'role',
				key: 'role',
			},
			{
				title: 'Created On',
				dataIndex: 'created_on',
				key: 'created_on',
			},
			{
				title: 'Last Login',
				dataIndex: 'last_login',
				key: 'last_login',
			}
		];
	}, []);

	if (!(session?.user?.role === 'admin')) {
		return <PermissionDenied />;
	}


	return (
		<Table bordered columns={tableColumns} dataSource={users} loading={usersLoading}/>
	);
};

export default Admin;