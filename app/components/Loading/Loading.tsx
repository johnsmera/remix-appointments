import { Progress } from "@chakra-ui/react";

type Props = {
  loading: boolean;
};
export const Loading = ({ loading }: Props) => {
  return (
    <div
      style={{
        height: loading ? "100%" : 0,
        width: loading ? "100%" : 0,
        minHeight: loading ? "2.4rem" : 0,
        marginLeft: loading ? "-0.8rem" : 0,
        visibility: loading ? "visible" : "hidden",

        opacity: "0.8",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
        position: "absolute",
        color: "#E2E0F5",
      }}
    >
      <Progress zIndex={9} size="xs" isIndeterminate />
    </div>
  );
};
