import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import { Outlet, useLocation, useNavigate } from "@remix-run/react";

export default function AppointmentsRoute() {
  const location = useLocation();
  const navigate = useNavigate();

  const isNewPage = location.pathname.includes("new");

  const goToNewAppointmentPage = () => navigate("/appointments/new");

  return (
    <Flex bgColor="#252338" minH="100vh" height="100%">
      <Container
        maxW="1320px"
        bgColor="#1d1d24"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box bg="#1d1d24" w="100%" p={8} paddingTop={6} minH="80vh">
          <Flex alignItems="center">
            <Text color="#b9b6d6" fontSize={26}>
              Agendamentos
            </Text>

            {!isNewPage && (
              <Button
                fontSize="16"
                onClick={goToNewAppointmentPage}
                marginLeft={4}
                bgColor="#2f2c55"
                color="#b9b6d6"
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
