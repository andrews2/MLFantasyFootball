/*
* Created by Andrew Shipman
* 4/15/2023
*/
import { Player } from "@/datatypes/Player";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Player = () => {
    const router = useRouter();
    const [data, setData] = useState<Player | null>();

    useEffect(() => {
        const { id } = router.query;
        if (id) {
            fetch('/api/playerData',{
            method: 'POST',
            body: JSON.stringify(id),
            headers: { "Content-Type": "application/json" }
        })
        .then(res => res.json())
        .then(data => {
            setData(data);
        });
        }
    }, [router.query]);

    return <p>{JSON.stringify(data)}</p>;
};

export default Player;