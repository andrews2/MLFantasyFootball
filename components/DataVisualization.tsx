/*
* Created by Andrew Shipman
* 4/15/2023
*/

import { Player } from "@/datatypes/Player";
import { Card, Divider, Row, Select, Space, Typography } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Text } = Typography;

type DataVisualizationProps = {
    player: Player | null;
}

const DataVisualization = ({ player }: DataVisualizationProps) => {
    const [mainStat, setMainStat] = useState('passing_yards');
    const [mainStatMax, setMainStatMax] = useState(50);

    useEffect(() => {
        if (player?.position === 'RB') {
            setMainStat('rushing_yards');
        } else if (player?.position === 'WR') {
            setMainStat('receiving_yards');
        }
        const statOptions = [];
        if (player?.stats) {
            for (const stat of Object.keys(player?.stats[player.years[0]])) {
                statOptions.push(stat.toUpperCase().replaceAll('_', ' '));
            }
        }
    }, [player?.position, player?.stats, player?.years]);

    const lineGraphOptions = useMemo(() => {
        if (player?.stats) {
            return  Object.keys(player?.stats[player.years[0]]).map((stat) => ({
                label: stat.toUpperCase().replaceAll('_', ' '),
                value: stat,
            }));
        } 
        return [];
    }, [player?.stats, player?.years]);

    const chartData = useMemo(() => {
        if (player?.stats) {
            const dataArray = [];
            let maxValue = 0;
            for (const year of player.years) {
                if (Number(player.stats[year][mainStat]) > maxValue) {
                    maxValue = Number(player.stats[year][mainStat]);
                }
                const dataPoint = {
                    name: year,
                    [mainStat.toUpperCase().replaceAll('_', ' ')]: player.stats[year][mainStat],
                };
                dataArray.push(dataPoint);
            }
            setMainStatMax(maxValue);
            return dataArray;
        }
        return [];
    }, [mainStat, player?.stats, player?.years]);

    const onLineGraphStatChange = useCallback((value: string) => {
        setMainStat(value);
    }, []);

    if (!player) {
        return <div />;
    }

    return (
        <>
            <Card>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Row align="middle">
                        <Text>Through The Years</Text>
                        <Divider type="vertical" />
                        <Select style={{ width: '25%'}} options={lineGraphOptions} onChange={onLineGraphStatChange} value={mainStat.toUpperCase().replaceAll('_', ' ')}/>
                    </Row>
                    <ResponsiveContainer width="100%" height={500}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, mainStatMax]}/>
                            <Tooltip />
                            <Line dataKey={mainStat.toUpperCase().replaceAll('_', ' ')} />
                        </LineChart>
                    </ResponsiveContainer>
                </Space>
            </Card>
            
        </>
       
    );

};

export default DataVisualization;