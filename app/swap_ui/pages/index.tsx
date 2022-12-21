import type { NextPage } from "next";
import HomePage from "../components/home";
import AppLayout from "../components/layout/layout";

const Home: NextPage = () => {
  return (
    <AppLayout>
      <HomePage />
    </AppLayout>
  );
};

export default Home;
