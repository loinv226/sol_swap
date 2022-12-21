import {
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { UseFormRegisterReturn } from "react-hook-form";

type TextFieldProps = {
  prefixEl?: JSX.Element | string;
  suffixEl?: JSX.Element | string;
  label?: JSX.Element | string;
  isSecure?: boolean;
  placeHolder?: string;
  errors?: any;
  id: string;
  validator?: UseFormRegisterReturn;
  mb?: string;
  prefixWidth?: string;
  subfixWidth?: string;
} & InputProps;
export function TextField({
  id,
  prefixEl,
  suffixEl,
  isSecure,
  placeHolder,
  errors,
  validator,
  label,
  mb,
  prefixWidth,
  subfixWidth,
  ...other
}: TextFieldProps) {
  const _errors = errors ?? {};
  return (
    <FormControl isInvalid={_errors[id]} mb={mb}>
      {label && typeof label === "string" ? (
        <Text textAlign="left" textStyle="body2" mb="8px">
          {label}
        </Text>
      ) : (
        label
      )}
      <InputGroup>
        {!!prefixEl && (
          <InputLeftElement w={prefixWidth ?? "55px"} mr="2px">
            {prefixEl}
          </InputLeftElement>
        )}
        <Input
          id={id}
          placeholder={placeHolder ?? ""}
          type={!isSecure ? "text" : "password"}
          fontSize="14px"
          color="text2"
          fontWeight="normal"
          errorBorderColor="border"
          borderColor="border"
          borderRadius="4px"
          // sx={{
          //   "::placeHolder": {
          //     color: "#66676B",
          //     opacity: 0.5,
          //   },
          // }}
          {...validator}
          {...other}
        />
        {!!suffixEl && (
          <InputRightElement w={subfixWidth} h="100%">
            {suffixEl}
          </InputRightElement>
        )}
        {/* pointerEvents="none"
            color="gray.300"
            fontSize="1.2em" */}
      </InputGroup>
      <FormErrorMessage fontSize={12}>
        {_errors[id] && _errors[id].message}
      </FormErrorMessage>
    </FormControl>
  );
}
