import type { Appointment } from "~/interfaces/Appointment";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { appointmentsService } from "~/services/Appointments.service";
import {
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Divider,
  Select,
  Input,
  InputGroup,
  InputRightAddon,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { Card } from "~/components/Card/Card";
import { Search2Icon } from "@chakra-ui/icons";
import { utcToZonedTime } from "date-fns-tz";
import { config } from "~/config/Config.server";
import { useMakeFilter } from "~/hooks/crud/makeFilter.hook";
import { useEffect, useState } from "react";

type LoaderData = {
  appointments: Appointment[];
  sort: string;
  timezone: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sort = (url.searchParams.get("sort") ||
    "start_time") as keyof Appointment;
  const sortType = (url.searchParams.get("sortType") || "asc") as
    | "desc"
    | "asc";
  const title = url.searchParams.get("title") || "";

  const deleteId = url.searchParams.get("deleteId") || "";

  const timezone = config.timezone || "";

  if (deleteId) {
    await appointmentsService.deleteAppointment(Number(deleteId));
  }

  const appointments = await appointmentsService.listAppointments({
    sort,
    sortType,
    title,
  });

  return json<LoaderData>({
    appointments,
    sort,
    timezone,
  });
};
export default function AppointmentIndexRoute() {
  const { appointments, timezone } = useLoaderData<
    typeof loader
  >() as LoaderData;
  const [toDelete, setToDelete] = useState({} as Appointment);

  const navigate = useNavigate();

  const { filteredItems, handleFilter, setFilteredItems, setOriginalItems } =
    useMakeFilter<Appointment>(appointments);

  const handleSort = (sort: string, sortType: "asc" | "desc") => {
    navigate(`/appointments?sort=${sort}&sortType=${sortType}`);
  };

  const handleDelete = () => {
    navigate(`/appointments?deleteId=${toDelete.id}`);
    onClose();
  };

  const onClose = () => setToDelete({} as Appointment);

  useEffect(() => {
    setFilteredItems(appointments);
    setOriginalItems(appointments);
  }, [appointments, setFilteredItems, setOriginalItems]);

  return (
    <Container p={0} maxW="100%">
      <Modal isCentered isOpen={!!toDelete.id} onClose={onClose}>
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="20%"
          backdropBlur="2px"
        />
        <ModalContent>
          <ModalHeader>Deletar agendamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{toDelete.title}</Text>
            <Text fontWeight="600">Essa alteração não poderá ser desfeita</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleDelete} bgColor="tomato">
              Deletar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Divider borderColor="#433bba" margin="1rem 0" />

      <Flex alignItems="center" gap={4}>
        <Heading color="#E2E0F5" as="h3" size="sm">
          Todos os agendamentos
        </Heading>

        <Select
          onChange={(e) =>
            handleSort(
              e.target.value,
              e.target.value === "end_time" ? "desc" : "asc"
            )
          }
          size="sm"
          maxW="10rem"
          placeholder="Ordenar por"
          color="#999"
        >
          <option value="title" style={{ color: "#000" }}>
            Título
          </option>
          <option value="start_time" style={{ color: "#000" }}>
            Data Início
          </option>
          <option value="end_time" style={{ color: "#000" }}>
            Data Fim
          </option>
        </Select>

        <InputGroup size="sm">
          <Input
            maxW="20rem"
            placeholder="Pesquisa por título"
            _placeholder={{ color: "#999" }}
            color="#999"
            onChange={(e) => handleFilter("title", e.target.value)}
          />
          <InputRightAddon children={<Search2Icon />} />
        </InputGroup>
      </Flex>

      <Divider borderColor="#433bba" margin="1rem 0" />

      {filteredItems.length === 0 && (
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          width="100%"
          height="24rem"
        >
          <Heading color="#E2E0F5" as="h3" size="sm">
            Nenhum agendamento encontrado :(
          </Heading>
        </Flex>
      )}

      <SimpleGrid columns={3} spacing={4} marginTop={4}>
        {filteredItems?.map((appointment) => (
          <div key={appointment.id}>
            <Card
              appointment={{
                ...appointment,
                end_time: utcToZonedTime(appointment.end_time, timezone),
                start_time: utcToZonedTime(appointment.start_time, timezone),
              }}
              handleDelete={(appointment: Appointment) => {
                setToDelete(appointment);
              }}
            />
          </div>
        ))}
      </SimpleGrid>
    </Container>
  );
}
