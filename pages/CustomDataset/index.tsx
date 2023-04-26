/*
* Created by Andrew Shipman
* 4/23/2023
*
* creates global layout used for all pages
*/

import { Player } from "@/datatypes/Player";
import { apiRequest, API_ENDPOINTS } from "@/FrontendAPI/API";
import useStatList from "@/hooks/useStatList";
import { Button, Card, Checkbox, DatePicker, Input, List, Radio, RadioChangeEvent, Select, Space, Spin, Steps, theme, Typography } from "antd";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import FileSaver from 'file-saver';
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useUserSession } from "@/hooks/useUserSession";
import PermissionDenied from "@/components/PermissionDenied";


const { Text, Paragraph } = Typography;

const CustomDataset = () => {
    const [players, setPlayers] = useState<Player[] | null>(null);
    const [playerDataLoading, setPlayerDataLoading] = useState(false);
    const [stepsIndex, setStepsIndex] = useState(0);
    const [selectedPlayersValue, setSelectedPlayersValue] = useState(1);
    const [years, setYears] = useState<null | (Dayjs | null)[]>([dayjs('2002'), dayjs('2022')]);
    const [statsMap, setStatsMap] = useState<Map<string, Record<string, any>>>(new Map());
    const [fileName, setFileName] = useState('Custom_Dataset');
    const [fileType, setFileType] = useState('csv');
    const [fileGenLoading, setFileGenLoading] = useState(false);
    const { token } = theme.useToken();

    const stats = useStatList();
    const { session } = useUserSession();

    const contentStyle: React.CSSProperties = {
        padding: '16px',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: '24px',
        height: '65vh',
    };

    useEffect(() => {
        setPlayerDataLoading(true);
        apiRequest(API_ENDPOINTS.ALL_PLAYERS, data => {
            setPlayerDataLoading(false);
            setPlayers(data as Player[]);
        });
    }, []);

    // set stats map
    useEffect(() => {
        stats.forEach((stat) => {
            statsMap.set(stat, {checked: true, name: stat});
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onNextClick = useCallback(() => {
        setStepsIndex(stepsIndex + 1);
    }, [stepsIndex]);

    const onPreviousClick = useCallback(() => {
        setStepsIndex(stepsIndex - 1);
    }, [stepsIndex]);

    const onSelectedPlayersChange = useCallback((e: RadioChangeEvent) => {
        setSelectedPlayersValue(e.target.value);
    }, []);

    const onGenerateFileClick = useCallback(() => {
        setFileGenLoading(true);
        const selectedYears: string[] = [];
        if (years && years[0] && years[1]) {
            // get the years
            for (let i = years[0].year(); i <= years[1].year(); i++){
                selectedYears.push(String(i));
            }
        }
        let selectedPosition: string | null = null;
        if (selectedPlayersValue === 2) {
            selectedPosition = 'QB';
        } else if (selectedPlayersValue === 3) {
            selectedPosition = 'RB';
        } else if (selectedPlayersValue === 4) {
            selectedPosition = 'WR';
        }
        const playerIds = players?.filter((player) => {
            let inTimeRange = false;
            let correctPosition = false;
            for (const year of player.years) {
                if (selectedYears.includes(year)) {
                    inTimeRange = true;
                    break;
                }
            }
            if (selectedPosition) {
                if (player.position === selectedPosition){
                    correctPosition = true;
                }
            }
            return inTimeRange && correctPosition;
        }).map((player) => {
            return player.player_id;
        });
        apiRequest(API_ENDPOINTS.MULTI_PLAYER_DATA, (data) => {
            const playerData = data as Player[];
            if (playerData instanceof Array){
                let fileString = '';
                const headders: string[] = [];
                // get headders and stat order
                const orderedStatNames: string[] = [];
                statsMap.forEach((value, key) => {
                    if (value.checked){
                        headders.push(value.name);
                        orderedStatNames.push(key);
                    }
                });
                fileString += headders.join(',') + '\n';
            

                // add player data
                for (const player of playerData) {
                    if (player.stats) {
                        for (const year of selectedYears) {
                            if (player.years.includes(year)) {
                                const line = [];
                                if (statsMap.get('name')?.checked) {
                                    line.push(player.name);
                                }
                                if (statsMap.get('season')?.checked) {
                                    line.push(year);
                                }
                                if (statsMap.get('position')?.checked) {
                                    line.push(player.position);
                                }
                                for (const stat of orderedStatNames) {
                                    if (stat === 'name' || stat === 'season' || stat === 'position') {
                                        continue;
                                    }
                                    line.push(player.stats[year][stat]);
                                }
                                fileString += line.join(',') + '\n';
                            }
                        }
                    }
                }
                const fileData = new Blob([fileString], { type: 'text/csv;charset=utf-8;' });
                FileSaver.saveAs(fileData, `${fileName}.${fileType}`);
            }
            setFileGenLoading(false);
        }, 'POST', JSON.stringify(playerIds));
    }, [fileName, fileType, players, selectedPlayersValue, statsMap, years]);

    const fileNameAddon = useMemo(() => {
        return <Select value={fileType} options={[{value: 'csv', label: '.csv'}, {value: 'txt', label: '.txt'}]} onChange={(value => {setFileType(value);})} style={{ width: '96px'}} />;
    }, [fileType]);

    const onYearChange = useCallback((years: null | (Dayjs | null)[]) => {
        setYears(years);
    }, []);

    const onStatsNameChange = useCallback((stat:string) => {
        return (e: ChangeEvent<HTMLInputElement>) => {
            const newMap = new Map(statsMap);
            const statObject = newMap.get(stat);
            newMap.set(stat, {...statObject, name: e.target.value});
            setStatsMap(newMap);
        };
    }, [statsMap]);

    const onStatCheckChange = useCallback((stat:string) => {
        return (e: CheckboxChangeEvent) => {
            const newMap = new Map(statsMap);
            const statObject = newMap.get(stat);
            newMap.set(stat, {...statObject, checked: e.target.checked });
            setStatsMap(newMap);
        };
    }, [statsMap]);

    const steps = useMemo(() => {
        return [
            {
                title: 'Select Data',
                content: (
                    <Space direction="vertical" style={{ width: '100%', height:'55vh', overflow: 'auto' }}>
                        <Card title="Choose Players">
                            <Radio.Group value={selectedPlayersValue} onChange={onSelectedPlayersChange}>
                                <Space direction="vertical">
                                    <Radio value={1}>All Players</Radio>
                                    <Radio value={2}>All Quarterbacks</Radio>
                                    <Radio value={3}>All Running Backs</Radio>
                                    <Radio value={4}>All Wide Receivers</Radio>
                                </Space>
                            </Radio.Group>
                        </Card>
                        <Card title="Choose Years">
                            <DatePicker.RangePicker picker="year" defaultValue={[dayjs('2002'), dayjs('2022')]} onChange={onYearChange} style={{ width: '100%' }}/>
                        </Card>
                    </Space>
                    
                )
            },
            {
                title: 'Format Statistics',
                content: (
                    <>
                        <Paragraph>Format your statistics by selecting which statistics to include in your dataset and naming the column titles.</Paragraph>
                        <List dataSource={stats} style={{ height: '55vh', overflow: 'auto'}} grid={{ column: 2}} renderItem={stat => (
                            <List.Item key={stat}>
                                <Card style={{ margin: '8px' }}>
                                    <Space>
                                        <Checkbox checked={statsMap.get(stat)?.checked} onChange={onStatCheckChange(stat)}/>
                                        <Text>{`${stat}:`}</Text>
                                        <Input onChange={onStatsNameChange(stat)} value={statsMap.get(stat)?.name}/>
                                    </Space>
                                </Card>
                            </List.Item>
                    )} />
                    </>
                ),
            },
            {
                title: 'Download File',
                content: (
                    <Space size="large" direction="vertical" style={{ width: '100%', height: '55vh', justifyContent: 'center'}}>
                        <Input value={fileName} onChange={e => setFileName(e.target.value)} addonAfter={fileNameAddon} />
                        <div style={{ float: 'right' }}>
                            <Button loading={fileGenLoading} onClick={onGenerateFileClick} type="primary">Generate File</Button>
                        </div>
                    </Space>
                )
            }
        ];
    }, [fileGenLoading, fileName, fileNameAddon, onGenerateFileClick, onSelectedPlayersChange, onStatCheckChange, onStatsNameChange, onYearChange, selectedPlayersValue, stats, statsMap]);

    if (!session) {
        return <PermissionDenied />;
    }

    return (
        <>
            <Spin spinning={playerDataLoading}>
                <Steps items={steps} current={stepsIndex}/>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={contentStyle}>{steps[stepsIndex].content}</div>
                    <Space>
                        <Button type="primary" onClick={onNextClick} disabled={stepsIndex === steps.length - 1}>Next</Button>
                        <Button onClick={onPreviousClick} disabled={stepsIndex === 0}>Previous</Button>
                    </Space>
                </Space>
            </Spin>
        </>
        
    );
};

export default CustomDataset;