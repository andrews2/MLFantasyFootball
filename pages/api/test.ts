import { Client } from 'pg';
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
    });
    client.connect();
    const query = 'SELECT * FROM users';
    client.query(query, (err, dbRes) => {
        if (err) {
            res.status(300).json(err);
        }
        res.status(200).json(dbRes);
    })
    ;
  }