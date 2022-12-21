import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import KButton from "../common/button";

type ConfirmSwapModalProps = {
  isOpen: boolean;
  onClose: (value?: any) => void;
};
export function ConfirmSwapModal(props: ConfirmSwapModalProps) {
  return (
    <Modal
      onClose={props.onClose}
      isOpen={props.isOpen}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent borderRadius="0px">
        <Box
          display="flex"
          justifyContent="center"
          //   borderBottom="1px solid #E2E2E2"
          px="24px"
        >
          <Text textStyle="h6" textAlign="center" mt="36px" mb="28px">
            Are you sure you want to swap?
          </Text>
          {/* <ModalCloseButton /> */}
        </Box>
        <ModalBody py="0px">
          <Box
            margin="0px auto"
            mb="24px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <KButton
              title="No"
              bg="transparent"
              color="text"
              w="73px"
              ml="12px"
              onClick={() => {
                props.onClose();
              }}
            />
            <KButton
              title="Yes"
              // color="text"
              w="73px"
              onClick={() => {
                props.onClose();
              }}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
