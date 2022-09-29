import { useNavigate } from "@remix-run/react";

import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/appointments");
  }, [navigate]);

  return (
    <Flex bgColor="#110f2f" height="100vh">
      Redirecionando :)
    </Flex>
  );
}
