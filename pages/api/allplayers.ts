/**
 * Created By Andrew Shipman
 * 4/15/2023
 */
 import { PGClient } from "@/classes/PGClient";
 import { NextApiRequest, NextApiResponse } from "next";

 export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const pgClient = new PGClient();
         pgClient.connect();
         const query = `SELECT player_id, Name, Position FROM players`;
         pgClient.query(query, (err, result) => {
            if (err) {
                res.status(400).send({ message: 'Error' });
            } else {
                const { rows } = result;
                if (rows.length) {
                    res.status(200).json(rows);
                } else {
                    res.status(404).send({ message: 'No players found' });
                }
            }
            pgClient.end();
        });
 }