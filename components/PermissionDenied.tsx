/*
* Created by Andrew Shipman
* 4/16/2023
*
* creates global layout used for all pages
*/

import { StopOutlined } from "@ant-design/icons";
import { Row, Space, Typography } from "antd";

const { Title } = Typography;

const PermissionDenied = () => {
	return (
		<Row align="middle" style={{ height: '80%', width: '100%'}}>
			<Space size="large" align="center" direction="vertical" style={{ width: '100%' }}>
				<StopOutlined type="warning" style={{ fontSize: '1000%' }} />
				<Title level={3}>Permission Denied. Please Log In.</Title>
			</Space>
		</Row>
        
	);
};

export default PermissionDenied;