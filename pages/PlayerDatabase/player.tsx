/*
* Created by Andrew Shipman
* 4/15/2023
*/
import { Player } from "@/datatypes/Player";
import { useRouter } from "next/router";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import PermissionDenied from "@/components/PermissionDenied";
import { Collapse, Empty, Layout, Select, Space, Table, Timeline, Typography } from 'antd';
import { apiRequest, API_ENDPOINTS } from "@/FrontendAPI/API";
import { useUserSession } from "@/hooks/useUserSession";
import DataVisualization from "@/components/DataVisualization";
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleOutlined, LineChartOutlined, QuestionCircleOutlined, TableOutlined, WarningOutlined } from "@ant-design/icons";


const { Title, Paragraph } = Typography;
const { Header, Content } = Layout;
const { Panel } = Collapse;

const Player = () => {
	const router = useRouter();
	const [player, setPlayer] = useState<Player | null>(null);
	const [dataLoading, setDataLoading] = useState(true);
	const { session } = useUserSession();
	const [selectedInjuryYear, setSelectedInjuryYear] = useState(0);

	const playerDataCallback = useCallback((data: unknown) => {
		setPlayer(data as Player);
		setDataLoading(false);
	}, []);

	useEffect(() => {
		const { id } = router.query;
		if (id) {
			apiRequest(API_ENDPOINTS.PLAYER_DATA, playerDataCallback, 'POST', JSON.stringify(id));
		}
	}, [playerDataCallback, router.query]);

	useEffect(() =>  {
		if (player?.years) {
			let maxYear = 0;
			for (const year of player.years) {
				if (Number(year) > maxYear) {
					maxYear = Number(year);
				}
			}
			setSelectedInjuryYear(maxYear);
		}
	}, [player?.years]);

	const tableColumns = useMemo((): ColumnsType<Record<string, string>> => {
		if (player?.stats) {
			const columns = Object.keys(player.stats[player.years[0]]).map(key =>  ({
				title: key.toUpperCase().replaceAll('_', ' '),
				dataIndex: key, 
				key: key,
				width: 200,
			}));
			return [{
				title: 'Year',
				dataIndex: 'year',
				key: 'year',
				width: 100,
				fixed: 'left',
				defaultSortOrder: 'ascend',
				sorter: (a, b) => { return Number(a.year) > Number(b.year) ? -1 : 1; }
			}, ...columns];
		}
		return [];
	}, [player?.stats, player?.years]);

	const tableData = useMemo(() => {
		if (player?.stats) {
			const dataArray = [];
			const yearArray = player.years;
			for (const year of yearArray) {
				let dataRow = {
					year: year,
				};
				Object.keys(player.stats[year]).forEach(key => {
					if (player?.stats) { 
						dataRow = {
							... dataRow,
							[key]: player?.stats[year][key],
						};
					}
				});
				dataArray.push(dataRow);
			}
			return dataArray;
		}
	}, [player?.stats, player?.years]);

	const timelineData = useMemo(() => {
		if (player?.injuries) {
			return player.injuries.filter(injury => Number(injury.season) === selectedInjuryYear).map(injury => {
				const children: ReactNode[] = [];
				if (injury.report_primary_injury.length > 0){
					children.push(<Paragraph>Primary Injury: {injury.report_primary_injury}</Paragraph>);
					children.push(<Paragraph>Status: {injury.report_status}</Paragraph>);
				}
				if (injury.practice_primary_injury.length > 0) {
					children.push(<Paragraph>Practice Injury: {injury.practice_primary_injury}</Paragraph>);
					children.push(<Paragraph>Practice Status: {injury.practice_status}</Paragraph>);
				}

				let colorAndIcon = {};

				switch (injury.report_status) {
				case 'Out':
					colorAndIcon = {
						color: 'red',
						dot: <WarningOutlined />,
					};
					break;
				case 'Questionable':
					colorAndIcon = {
						color: 'blue',
						dot: <QuestionCircleOutlined />,
					};
					break;
				default:
					colorAndIcon = {
						color: 'green',
						dot: <CheckCircleOutlined />,
					};
					break;
				}
				return {
					...colorAndIcon,
					label: `${selectedInjuryYear}, Week ${Number(injury.week)}`,
					children: (<>{...children}</>),
				};
			});

		}
		return [];
	}, [player?.injuries, selectedInjuryYear]);

	const injuryYearSelectOptions = useMemo(() => {
		if (player?.years) {
			return player.years.map(year => ({
				label: year,
				value: Number(year),
			})).reverse();
		}
		return [];
	}, [player?.years]);

	const onInjuryYearChange = useCallback((value: number) => {
		setSelectedInjuryYear(value);
	}, []);

	const renderTimeLine = useMemo(() => {
		if (timelineData.length > 0) {
			return <Timeline reverse items={timelineData} mode="left" />;
		}
		return <Empty description="No Injury Data" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
	}, [timelineData]);

	if (!session) {
		return <PermissionDenied />;
	}

	return (
		<>
			<Layout  style={{background: '#ffffff', height: '100%'}}>
				<Header style={{ padding: 0, background: '#ffffff' }}>
					<Title level={2}>{player?.name}</Title>
				</Header>
				<Content style={{ marginTop: '24px', background: '#ffffff', padding: 0}}>
					<Collapse defaultActiveKey={['1']} ghost size="large">
						<Panel header={<Space><LineChartOutlined />Data Visualization</Space>} key="1">
							<DataVisualization player={player} />
						</Panel>
						<Panel header={<Space><TableOutlined />Statistics</Space>} key="2">
							<Table columns={tableColumns} dataSource={tableData} bordered scroll={{ x: '100%', y: '70vh' }} loading={dataLoading} pagination={false}/>
						</Panel>
						<Panel header={<Space><WarningOutlined />Injury Report</Space>} key="3">
							<Select onChange={onInjuryYearChange} style={{ width: '25%'}} value={selectedInjuryYear} options={injuryYearSelectOptions} />
							{renderTimeLine}
						</Panel>
					</Collapse>    
				</Content>
			</Layout>
		</>
	);
};

export default Player;