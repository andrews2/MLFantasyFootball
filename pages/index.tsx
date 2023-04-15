/*
* Created by Andrew Shipman
* 4/12/2023
*/
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();


  return (
      <>
          <p>{JSON.stringify(session?.user)}</p>
      </>
  );

};

export default Home;
