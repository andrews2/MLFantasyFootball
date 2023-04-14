import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const testData = [{name: 'Patrick Mahomes', position: 'QB'}, {name: 'Tom Brady', position: 'QB'}, {name: 'Deandre Hopkins', position: 'WR'}, {name: 'Aaron Jones', position: 'RB'}];
    const testDataToSend = JSON.stringify(testData);
    res.status(200).json(testDataToSend);
  }