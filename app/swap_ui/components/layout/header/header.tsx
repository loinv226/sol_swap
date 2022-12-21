import React from "react";
import { Box } from "@chakra-ui/react";

import { Z_INDEX } from "../../../config/theme.config";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import KButton from "../../common/button";
import useAirdrop from "./use_airdrop";

type Props = {
  // handleMenuOpen: Function;
};

const Header = function (props: Props) {
  const { wallet, airDrop, loading } = useAirdrop();

  return (
    <Box bg="paper" position="fixed" w="100%" zIndex={Z_INDEX.header}>
      <Box
        pos="relative"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        maxW="1440px"
        margin="0px auto"
        minH="58px"
        padding="0px 10px"
      >
        <KButton
          h="40px"
          // variant="outline"
          isLoading={loading}
          disabled={!wallet.connected}
          title="Airdrop 1 SOL"
          onClick={airDrop}
        />
        <Box />
        <WalletMultiButton
          style={{
            height: "40px",
            justifyContent: "center",
            background: "var(--chakra-colors-primary)",
          }}
        />
      </Box>
    </Box>
  );
};
export default Header;
