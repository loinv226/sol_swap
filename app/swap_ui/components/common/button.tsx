import { Button, ButtonProps, Image, Text } from "@chakra-ui/react";
import Link from "next/link";

type KButtonProps = {
  title: string;
  icon?: string;
  iconSize?: any;
  iconSpace?: any;
  highligtHover?: boolean;
  href?: string;
} & ButtonProps;

export default function KButton({
  title,
  icon,
  iconSize,
  iconSpace,
  href,
  ...other
}: KButtonProps) {
  const { fontSize, variant, highligtHover } = other;
  delete other.highligtHover;

  const content = (
    <Button
      // as={href != null ? "div" : "button"}
      // cursor="pointer"
      borderRadius="4px"
      borderColor={variant == "outline" ? "primary" : "border"}
      bg={
        variant == "outline"
          ? "transparent"
          : highligtHover
          ? "background"
          : "primary"
      }
      color={
        variant == "outline" ? "primary" : highligtHover ? "text" : "white"
      }
      _hover={
        highligtHover
          ? {
              color: "white",
              bg: "primary",
            }
          : {}
      }
      tabIndex={-1}
      {...other}
    >
      {icon && (
        <Image
          src={icon}
          alt=""
          w={iconSize}
          h={iconSize}
          mr={iconSpace == null ? "16px" : iconSpace}
        />
      )}
      <Text
        textStyle={other.textStyle ?? "body2"}
        color="inherit"
        fontSize={fontSize}
        // textAlign="center"
      >
        {title}
      </Text>
    </Button>
  );
  if (href != null) {
    return <Link href={href}>{content}</Link>;
  }
  return <>{content}</>;
}
