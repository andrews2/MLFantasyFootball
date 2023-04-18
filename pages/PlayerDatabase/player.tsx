/*
* Created by Andrew Shipman
* 4/15/2023
*/
import { Player } from "@/datatypes/Player";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import PermissionDenied from "@/components/PermissionDenied";
import { Card, Layout, Table, Typography } from 'antd';
import { apiRequest, API_ENDPOINTS } from "@/FrontendAPI/API";

const { Text, Title } = Typography;
const { Header, Content } = Layout;

const Player = () => {
    const router = useRouter();
    const [player, setPlayer] = useState<Player | null>();
    const [dataLoading, setDataLoading] = useState(true);
    const { data: session } = useSession();

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

    const tableColumns = useMemo(() => {
        if (player?.stats) {
            const columns = Object.keys(player.stats[player.years[0]]).map(key =>  ({
                title: key,
                dataIndex: key, 
                key: key,
            }));
            return [{
                title: 'Year',
                dataIndex: 'year',
                key: 'year',
            }, ...columns];
        }
        return [];
    }, [player?.stats, player?.years]);

    const tableData = useMemo(() => {
        if (player?.stats) {
            const dataArray = [];
            for (const year of player.years) {
                let dataRow = {
                    year: year,
                };
                Object.keys(player.stats[year]).forEach(key => {
                    if (player?.stats) { 
                        dataRow = {
                            ... dataRow,
                            [key]: player?.stats[player.years[0]][key],
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
                <Content>
                    <Table columns={tableColumns} dataSource={tableData} scroll={{x: '100%'}} loading={dataLoading} pagination={false}/>
                </Content>
            </Layout>
        </>
        );
};

export default Player;