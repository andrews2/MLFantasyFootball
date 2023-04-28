/*
* Created by Andrew Shipman
* 4/12/2023
*/
import { Input, Layout, Table, Card, Space, DatePicker } from "antd";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { SearchOutlined, ToolOutlined } from "@ant-design/icons";
import type { ColumnsType } from 'antd/es/table';
import { Player } from "@/datatypes/Player";
import { useRouter } from "next/router";
import PermissionDenied from "@/components/PermissionDenied";
import { Dayjs } from 'dayjs';
import { apiRequest, API_ENDPOINTS } from "@/FrontendAPI/API";
import { useUserSession } from "@/hooks/useUserSession";

const { Sider, Content } = Layout;

interface TableDataType {
    key: string;
    name: string;
    position: string;
    player_id: string;
}

const PlayerDatabase = () => {
	const [players, setPlayers] = useState<Player[] | null>(null);
	const { session } = useUserSession();
	const [playerDataLoading, setPlayerDataLoading] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [years, setYears] = useState<null | (Dayjs | null)[]>([]);
    
	const router = useRouter();

	useEffect(() => {
		setPlayerDataLoading(true);
		apiRequest(API_ENDPOINTS.ALL_PLAYERS, data => {
			setPlayerDataLoading(false);
			setPlayers(data as Player[]);
		});
	}, []);

	const tableColumns = useMemo((): ColumnsType<TableDataType> => {
		return [
			{
				title: 'Name', 
				dataIndex: 'name', 
				key: 'name',
				sorter: (a, b) => a.name.localeCompare(b.name), 
			}, 
			{
				title: 'Position',
				dataIndex: 'position',
				key: 'position',
				filters: [
					{text: 'QB', value: 'QB'},
					{text: 'RB', value: 'RB'},
					{text: 'WR', value: 'WR'},
				],
				onFilter: (value: string | number | boolean, record: TableDataType) => record.position === value,
				sorter: (a, b) => b.position.localeCompare(a.position),
			}
		];
	}, []);

	const tableData = useMemo((): TableDataType[] => {
		if (players) {
			return players.map((player, index) => {
				return {key: String(index), name: player.name, position: player.position, player_id: player.player_id, years: player.years};
			}).filter((player) => {
				let inYearRange = true;
				if (years) {
					if (years[0] && years[1]) {
						inYearRange = false;
						for (let i = years[0].year(); i <= years[1].year(); i++) {
							if (player.years.includes(String(i))) {
								inYearRange = true;
								break;
							}
						}
					}
				}
				return player.name.toLowerCase().includes(searchText.toLowerCase()) && inYearRange;
			});
		}
		return [];
	}, [players, searchText, years]);

	const onSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
	}, []);

	const onRow = useCallback((record: TableDataType) => {
		return {
			onClick: () => {
				router.push({
					pathname: '/PlayerDatabase/player',
					query: { id: record.player_id },
				});
			},
		};
	}, [router]);

	const onYearChange = useCallback((years: null | (Dayjs | null)[]) => {
		setYears(years);
	}, []);

	if (!session) {
		return <PermissionDenied />;
	}

	return (
		<Layout style={{background: '#ffffff', height: '100%'}}>
			<Sider style={{background: '#ffffff' }} width="25%">
				<Card title={<><ToolOutlined/> Tools</>} style={{ height: '100%' }}>
					<Space direction="vertical" size={32} style={{ width: '100% '}}>
						<Input autoComplete="disabled" prefix={<SearchOutlined />} placeholder="Search..." onChange={onSearchChange} value={searchText} allowClear/>
						<DatePicker.RangePicker picker="year" onChange={onYearChange} style={{ width: '100%' }}/>
					</Space>
				</Card>
			</Sider>
			<Content style={{ marginLeft: '16px' }}> 
				<Table bordered sticky columns={tableColumns} dataSource={tableData} scroll={{ y: 'calc(72vh - 4em)' }} loading={playerDataLoading} onRow={onRow} style={{cursor: "pointer"}}/>
			</Content>
		</Layout>
	);
};

export default PlayerDatabase;