/*
* Created by Andrew Shipman
* 4/12/2023
*/

import { useEffect, useState } from "react";

const Home = () => {
  const [textData, setData] = useState('');

  useEffect(() => {
    fetch('/api/test')
    .then(res => res.json())
    .then(data => {
        setData(JSON.parse(data));
    });
}, []);


  return (
      <>
          <p>{textData}</p>
      </>
  );
};
export default Home;
