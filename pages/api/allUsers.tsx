/**
 * Created By Andrew Shipman
 * 4/16/2023
 */

import { PGClient } from "@/classes/PGClient";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getServerSession(req, res, authOptions);
	if (session?.user?.role === 'admin') {
		const pgClient = new PGClient();
		pgClient.connect();
		const query = 'SELECT * FROM Users';
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
	else {
		res.status(400).send({ message: 'unauthorized' });
	}
}