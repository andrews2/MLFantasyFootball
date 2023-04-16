/*
* Created by Andrew Shipman
* 4/12/2023
*/
import { useSession } from "next-auth/react";
import { Typography, Space } from "antd";

const { Text } = Typography;

const Home = () => {
  const { data: session } = useSession();


  return (
      <>
          <p>{JSON.stringify(session?.user)}</p>
          <Space direction="vertical" size="large">
              <Text>Welcome to MLFantasyFootball.com, the ultimate destination for fantasy football enthusiasts looking to take their game to the next level. Our cutting-edge web app uses data analytics and machine learning to provide users with powerful insights and analysis on player statistics, projections, injury reports, and more. Whether you're a seasoned fantasy football veteran or a novice just starting, MLFantasyFootball.com has everything you need to build a winning team.</Text>
              <Text>At MLFantasyFootball.com, we're committed to providing users with the most advanced and accurate analysis possible. Our platform leverages the latest machine learning algorithms to provide personalized recommendations and insights tailored to each user's preferences and needs. Our intuitive and user-friendly interface makes it easy for users to access the information they need, while our team of experienced data scientists and fantasy football experts are dedicated to ensuring that our platform remains at the forefront of innovation in the industry.</Text>
              <Text>With MLFantasyFootball.com, you'll have access to a wide range of tools and features to help you build a winning team. From player comparisons to injury analysis to projected statistics, our platform provides users with everything they need to make informed decisions and stay ahead of the competition. So why wait? Sign up for MLFantasyFootball.com today and start dominating your fantasy football league like never before!</Text>
          </Space>
          
      </>
  );

};

export default Home;
