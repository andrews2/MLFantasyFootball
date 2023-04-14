import { Client } from 'pg';
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const isProduction = process.env.NODE_ENV === "production";
    const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
    const client = new Client({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: Number(process.env.PORT),
        database: process.env.DATABASE,
        ssl: {
          rejectUnauthorized: false
        }
    });
    client.connect();
    const query = 'SELECT * FROM users';
    client.query(query, (err, dbRes) => {
        if (err) {
            res.status(300).json(err);
        } else {
            res.status(200).json(dbRes);
        }
        client.end();
    });
    
  }