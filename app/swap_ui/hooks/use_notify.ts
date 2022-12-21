import { useToast } from "@chakra-ui/react";
import { AnchorError } from "@project-serum/anchor";

export function useNotify() {
  const toast = useToast();

  function handleError(err: any) {
    if (!err) {
      return;
    }
    if (err.code === 401) {
      return;
    }
    console.log("err: ", err);
    toast({
      status: "error",
      title: Array.isArray(err.message)
        ? typeof err.message[0] === "string"
          ? err.message[0]
          : Object.values(err.message[0])[0]
        : err.message ?? "Request failed",
      isClosable: true,
    });
  }

  function handleAnchorError(err: AnchorError) {
    toast({
      status: "error",
      title: err.error.errorMessage ?? "Request failed",
      isClosable: true,
    });
  }

  function success(msg: string) {
    toast({
      status: "success",
      title: msg,
      isClosable: true,
    });
  }
  function warning(msg: string) {
    toast({
      status: "warning",
      title: msg,
      isClosable: true,
    });
  }

  return { handleError, handleAnchorError, success, warning };
}
