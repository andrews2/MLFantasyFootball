/**
 * Created By Andrew Shipman
 * 4/15/2023
 */
 import { Client, QueryResult } from 'pg';

export class PGClient {
    client: Client;

    constructor() {
        const isProduction = process.env.NODE_ENV === "production";
        const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
        this.client = new Client({
            connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            port: Number(process.env.PORT),
            database: process.env.DATABASE,
            ssl: {
            rejectUnauthorized: false
            }
        });
    }

    connect() { 
        this.client.connect();
    }

    end() {
        this.client.end();
    }

    query(query: string, callback: (err: Error, result: QueryResult) => void) {
        this.client.query(query, callback);
    }
}