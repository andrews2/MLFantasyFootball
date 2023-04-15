/*
* Created by Andrew Shipman
* 4/12/2023
*/

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const Home = () => {
  const [textData, setData] = useState('');
  const { data: session } = useSession();

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
          <p>{session?.user?.name}</p>
      </>
  );
};
export default Home;
