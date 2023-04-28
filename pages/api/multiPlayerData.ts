/**
 * Created By Andrew Shipman
 * 4/24/2023
 */
import { PGClient } from "@/classes/PGClient";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions); 
	if (req.method === 'POST' && session && req.body instanceof Array) {
		const multi_player_id = req.body as Array<string>;
		const pgClient = new PGClient();
		pgClient.connect();
		let query = `SELECT * FROM players WHERE`;
		multi_player_id.forEach((id, index )=> {
			query += ` player_id=${id}`;
			if (index < multi_player_id.length - 1) {
				query += ' OR ';
			}
		});
		pgClient.query(query, (err, result) => {
			if (err) {
				res.status(400).send({ message: 'Error' });
			} else {
				const { rows } = result;
				if (rows.length > 0) {
					res.status(200).json(rows);
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