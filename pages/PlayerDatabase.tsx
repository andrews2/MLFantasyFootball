/*
* Created by Andrew Shipman
* 4/12/2023
*/
import { Input, Layout } from "antd";
import { useEffect, useMemo, useState } from "react";

const { Sider, Content } = Layout;

const PlayerDatabase = () => {
    const [players, setPlayers] = useState<Record<string, string>[] | null>(null);

    useEffect(() => {
        fetch('/api/players')
        .then(res => res.json())
        .then(data => {
            setPlayers(JSON.parse(data))
        })
    }, [])

    const displayText = useMemo(() => {
        if (players) {
            return players.map(player => {
                return <p key={player.name}>{`${player.name}, ${player.position}`}</p>
            })
        }
        return <p>no data</p>
    }, [players])


    return (
        <Layout>

        </Layout>
    )
}

export default PlayerDatabase;