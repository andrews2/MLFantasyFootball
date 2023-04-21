/*
* Created by Andrew Shipman
* 4/15/2023
*/
import { Player } from "@/datatypes/Player";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import PermissionDenied from "@/components/PermissionDenied";
import { Collapse, Layout, Space, Table, Typography } from 'antd';
import { apiRequest, API_ENDPOINTS } from "@/FrontendAPI/API";
import { useUserSession } from "@/hooks/useUserSession";
import DataVisualization from "@/components/DataVisualization";
import type { ColumnsType } from 'antd/es/table';
import { LineChartOutlined, TableOutlined } from "@ant-design/icons";


const { Title } = Typography;
const { Header, Content } = Layout;
const { Panel } = Collapse;

const Player = () => {
    const router = useRouter();
    const [player, setPlayer] = useState<Player | null>(null);
    const [dataLoading, setDataLoading] = useState(true);
    const { session } = useUserSession();

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
                            <Table columns={tableColumns} dataSource={tableData} scroll={{ x: '100%', y: '70vh' }} loading={dataLoading} pagination={false}/>
                        </Panel>
                    </Collapse>    
                </Content>
            </Layout>
        </>
        );
};

export default Player;