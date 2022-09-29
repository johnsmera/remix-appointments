import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import { Outlet, useLocation, useNavigate } from "@remix-run/react";

export default function AppointmentsRoute() {
  const location = useLocation();
  const navigate = useNavigate();

  const isNewPage = !location.pathname.includes("new");

  const goToNewAppointmentPage = () => navigate("/appointments/new");

  return (
    <Flex bgColor="#110f2f" minH="100vh" height="100%">
      <Container
        maxW="1320px"
        backgroundColor="#110f2f"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box bg="#060510" w="100%" p={8} paddingTop={6} minH="80vh">
          <Flex alignItems="center">
            <Text color="#E2E0F5" fontSize={26}>
              Agendamentos
            </Text>

            {isNewPage && (
              <Button
                fontSize="16"
                onClick={goToNewAppointmentPage}
                marginLeft={4}
                bgColor="#221d5d"
                color="#E2E0F5"
              >
                <AddIcon fontSize={12} marginRight="2" /> Novo
              </Button>
            )}
          </Flex>

          <Outlet />
        </Box>
      </Container>
    </Flex>
  );
}
