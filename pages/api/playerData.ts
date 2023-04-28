/**
 * Created By Andrew Shipman
 * 4/15/2023
 */
import { PGClient } from "@/classes/PGClient";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions); 
	if (req.method === 'POST' && session) {
		const player_id = req.body;
		const pgClient = new PGClient();
		pgClient.connect();
		const query = `SELECT * FROM players WHERE player_id = '${player_id}'`;
		pgClient.query(query, (err, result) => {
			if (err) {
				res.status(400).send({ message: 'Error' });
			} else {
				const { rows } = result;
				if (rows.length  === 1) {
					res.status(200).json(rows[0]);
				} else {
					res.status(404).send({ message: 'user not found' });
				}
			}
			pgClient.end();
		});
	} else {
		res.status(404);
	}
}