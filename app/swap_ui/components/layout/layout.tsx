import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import DocHead from "./doc_head";
// import Header from "./header/header";
const Header = dynamic(() => import("./header/header"), { ssr: false });

function AppLayout(props: any) {
  const { children } = props;

  return (
    <Box bg="background">
      <DocHead />
      <Header />
      <Box className="spaceTop" height={"58px"} w={"100%"}></Box>
      {children}
    </Box>
  );
}

export default AppLayout;
