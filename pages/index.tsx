/*
* Created by Andrew Shipman
* 4/12/2023
*/

import { useEffect, useState } from "react";

const Home = () => {
  const [textData, setData] = useState('');

  useEffect(() => {
    fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'Admin'}),
    })
    .then(res => res.json())
    .then(data => {
          setData(JSON.stringify(data));
    });
}, []);


  return (
      <>
          <p>{textData}</p>
      </>
  );
};
export default Home;
