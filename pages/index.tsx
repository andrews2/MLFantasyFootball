/*
* Created by Andrew Shipman
* 4/12/2023
*/

import { Typography, Space } from "antd";
import { useUserSession } from "@/hooks/useUserSession";

const { Text } = Typography;

const Home = () => {

  return (
      <>
          <Space direction="vertical" size="large">
              <Text>Welcome to Football Forecaster, the ultimate destination for anyone looking to gain an edge in fantasy football drafts. Our web app is designed to help you navigate the complex world of fantasy football with ease, using advanced data analytics and machine learning to provide you with the insights you need to make informed decisions. With Football Forecaster, you&apos;ll have access to the latest player projections, rankings, and other key data points, allowing you to build a winning team and stay ahead of the competition.</Text>
              <Text>At Football Forecaster, we know that fantasy football is all about data. That&apos;s why we&apos;ve made it our mission to gather and analyze the most up-to-date data available, using advanced machine learning algorithms to predict player performance and identify key trends. Whether you&apos;re a seasoned veteran or a newcomer to the world of fantasy football, our powerful tools and resources can help you make the most informed decisions possible.</Text>
              <Text>Our web app is designed with the user in mind, providing a user-friendly interface that allows you to easily access player projections, rankings, and other important data points. Whether you&apos;re drafting for a standard or a PPR league, our customizable reports and advanced analytics give you a comprehensive view of player performance, helping you make strategic draft picks and stay ahead of the competition.</Text>
              <Text>With Football Forecaster, you&apos;ll have access to a wide range of features and tools, including custom reports, data visualizations, and personalized recommendations. Our team of expert analysts is constantly monitoring the latest trends and developments in fantasy football, ensuring that you have the most up-to-date information available at all times.</Text>
              <Text>So why wait? Sign up today and start using Football Forecaster to take your fantasy football game to the next level. Whether you&apos;re a casual fan or a serious competitor, our web app is the ultimate resource for anyone looking to gain an edge in fantasy football drafts.</Text>
          </Space>
          
      </>
  );

};

export default Home;
