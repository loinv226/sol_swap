require("@solana/wallet-adapter-react-ui/styles.css");
import { Box, Image, Text } from "@chakra-ui/react";
import useSwap from "./hooks/use_swap";
import { TextField } from "../common/input/textfield";
import KButton from "../common/button";

export default function HomePage() {
  const { wallet, receiveAmount, swap, _form } = useSwap();

  async function onSubmit(values: any) {
    // console.log("values:", values);
    // return upload(values);
    await swap();
  }

  return (
    <Box bg="background" h="100%">
      <Box
        py="24px"
        px={{ base: "32px", "2xl": "69px" }}
        maxW="1440px"
        minH="100vh"
        margin="0px auto"
      >
        <Box
          maxW="420px"
          margin="0px auto"
          bg="paper"
          p="16px"
          borderRadius="8px"
          mt="80px"
        >
          <Text textStyle="h6" mb="16px">
            Swap
          </Text>
          <Text textStyle="caption">{`${wallet.publicKey} - connected: ${wallet.connected}}`}</Text>
          <form
            onSubmit={_form.handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <TextField
              id="from"
              placeholder="Amount"
              // type="number"
              bg="paper"
              h="60px"
              errors={_form.formState.errors}
              validator={_form.register("from", {
                required: "This is required",
                max: {
                  value: 100,
                  message: "Swap amount must less than 100 sol",
                },
              })}
              suffixEl={
                <Text textStyle="caption" color="text">
                  SOL
                </Text>
              }
            />
            <Image src="/icons/ic_swap.svg" alt="" h="24px" my="8px" />
            <TextField
              id="to"
              placeholder="Amount"
              type="number"
              bg="paper"
              h="60px"
              value={receiveAmount}
              isDisabled
              suffixEl={
                <Text textStyle="caption" color="text" mr="12px">
                  MOVE
                </Text>
              }
            />
            <KButton
              h="50px"
              mt="16px"
              isLoading={_form.formState.isSubmitting}
              disabled={!wallet.connected || !_form.formState.isValid}
              type="submit"
              title="Confirm swap"
            />
          </form>
        </Box>
      </Box>
    </Box>
  );
}
