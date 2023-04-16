/*
* Created by Andrew Shipman
* 4/12/2023
*/
import { Input, Layout, Table, Card, Space, Typography } from "antd";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from 'antd/es/table';
import { useSession } from "next-auth/react";
import { Player } from "@/datatypes/Player";
import { useRouter } from "next/router";

const { Sider, Content } = Layout;
const { Text } = Typography;

interface TableDataType {
    key: string;
    name: string;
    position: string;
    player_id: string;
}

const PlayerDatabase = () => {
    const [players, setPlayers] = useState<Player[] | null>(null);
    const { data: session } = useSession();
    const [playerDataLoading, setPlayerDataLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    
    const router = useRouter();

    useEffect(() => {
        setPlayerDataLoading(true);
        fetch('/api/allplayers')
        .then(res => res.json())
        .then(data => {
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
                return {key: String(index), name: player.name, position: player.position, player_id: player.player_id};
            }).filter((player) => player.name.toLowerCase().includes(searchText.toLowerCase()));
        }
        return [];
    }, [players, searchText]);

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

    if (!session) {
        return <Text>you do not have permission to view this page...</Text>;
    }

    return (
        <Layout style={{background: '#ffffff', height: '100%'}}>
            <Sider style={{background: '#ffffff' }} width="25%">
                <Card title="Tools" style={{ height: '100%' }}>
                    <Space direction="vertical" size={32} style={{ width: '100% '}}>
                        <Input prefix={<SearchOutlined />} placeholder="Search..." onChange={onSearchChange} value={searchText}/>
                    </Space>
                </Card>
            </Sider>
            <Content style={{ marginLeft: '16px' }}> 
                <Table sticky columns={tableColumns} dataSource={tableData} scroll={{ y: 'calc(72vh - 4em)' }} loading={playerDataLoading} onRow={onRow}/>
            </Content>
        </Layout>
    );
};

export default PlayerDatabase;