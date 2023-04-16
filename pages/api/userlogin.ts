/**
 * Created By Andrew Shipman
 * 4/15/2023
 */
 import { PGClient } from "@/classes/PGClient";
 import { NextApiRequest, NextApiResponse } from "next";
 
 export default function handler(req: NextApiRequest, res: NextApiResponse) {
     if (req.method === 'POST') {
         const { username, password } = req.body;
         const pgClient = new PGClient();
         pgClient.connect();
         const query = `SELECT * FROM users WHERE username = '${username}'`;
         pgClient.query(query, (err, result) => {
             if (err) {
                 res.status(400).send({ message: 'Error' });
             } else {
                 const { rows } = result;
                 if (rows.length  === 1) {
                     if (password === rows[0].password) {
                        delete rows[0].password;
                        res.status(200).json(rows[0]);
                     } else {
                        res.status(400).send({ message: 'Incorrect Password' });
                     }
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