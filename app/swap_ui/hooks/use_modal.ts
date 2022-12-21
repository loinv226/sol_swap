import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

export function useModal<T>() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState<T>();

  function onCloseWith(value?: T) {
    onClose();
    setData(value);
  }
  return {
    isOpen,
    onOpen,
    onClose,
    onCloseWith,
    data,
    setData,
  };
}
