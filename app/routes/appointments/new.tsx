import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
  Container,
  Heading,
  SimpleGrid,
  Input,
  Divider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Select,
} from "@chakra-ui/react";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { addMinutes, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import ReactDatePicker from "react-datepicker";
import stylesDatepicker from "react-datepicker/dist/react-datepicker.css";
import styles from "~/styles/datepicker.css";
import { getMinDiff } from "~/utils/date";
import { appointmentsService } from "~/services/Appointments.service";
import type { ListDateOutput } from "~/services/IAppointments";

export const links = () => [
  {
    rel: "stylesheet",
    href: stylesDatepicker,
  },
  {
    rel: "stylesheet",
    href: styles,
  },
];

type LoaderData = {
  occuppedDates: ListDateOutput[];
};
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const date = url.searchParams.get("date");

  if (!date) return json<LoaderData>({ occuppedDates: [] });

  if (date.split("-")?.length !== 3) throw new Error("Incorrectly date");

  const occuppedDates = await appointmentsService.listDate(new Date(date));

  return json<LoaderData>({ occuppedDates });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const title = form.get("title");
  const time = form.get("time");
  const date = form.get("date");
  const duration = form.get("duration");

  if (
    typeof date !== "string" ||
    typeof title !== "string" ||
    typeof duration !== "string" ||
    typeof time !== "string"
  ) {
    throw new Error("Please fill correctly.");
  }

  const utcDate = new Date(
    parse(`${date} ${time}`, "dd/MM/yyyy HH'h'mm", new Date())
  );

  const startTime = new Date(
    utcDate.getTime() - utcDate.getTimezoneOffset() * 60000
  );

  const endTime = addMinutes(startTime, Number(duration));

  const fields = {
    title,
    startTime,
    endTime,
  };

  await appointmentsService.createAppointment(fields);

  return redirect("/appointments");
};

export default function NewAppointmentRoute() {
  const { occuppedDates } = useLoaderData<typeof loader>() as LoaderData;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const [selectedDuration, setSelectedDuration] = useState<number>(30);

  const [excludedTimes, setExcludedTimes] = useState<Date[]>([]);

  const selectedDateIsGreaterThanToday = useMemo(() => {
    if (selectedDate === null) return false;

    const currentDate = new Date();

    return selectedDate.setHours(0, 0, 0, 0) > currentDate.setHours(0, 0, 0, 0);
  }, [selectedDate]);

  const navigate = useNavigate();

  const timeSpacing = 15;

  const filterPassedTime = (time: any) => {
    const current = new Date();
    const selected = new Date(time);

    return current.getTime() < selected.getTime();
  };

  const filterPassedDate = (time: any) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    const isSameDate =
      selectedDate.getDate() === currentDate.getDate() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear();

    return selectedDate.getTime() >= currentDate.getTime() || isSameDate;
  };

  const goToRoute = (route: string) => navigate(route);

  useEffect(() => {
    setExcludedTimes([]);

    const handleSetExcluded = () => {
      occuppedDates.forEach((occupped) => {
        const _start = parse(
          occupped.startTime,
          "yyyy-MM-dd'T'HH:mm:ss'",
          new Date()
        );

        const _end = parse(
          occupped.endTime,
          "yyyy-MM-dd'T'HH:mm:ss'",
          new Date()
        );

        const minutesDiff = getMinDiff(_start, _end);

        const ranges: Date[] = [];

        for (let i = 0; i < minutesDiff + timeSpacing; i = i + timeSpacing) {
          const timeAddedMinute = addMinutes(_start, i);

          if (!ranges.includes(timeAddedMinute)) {
            ranges.push(timeAddedMinute);
          }
        }

        setExcludedTimes((excludeds) => [...excludeds, ...ranges]);
      });
    };

    handleSetExcluded();
  }, [occuppedDates]);

  return (
    <Container p={0} maxW="100%" color="#e2e0f5">
      <Divider borderColor="#343160" margin="1rem 0" />

      <Breadcrumb fontWeight="medium" fontSize="sm" separator=">">
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => goToRoute("/appointments")}>
            Agendamentos
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isLastChild>
          <BreadcrumbLink>Novo</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Divider borderColor="#343160" margin="1rem 0" />

      <Heading color="#e2e0f5" as="h3" size="sm">
        Novo agendamento
      </Heading>

      <Form method="post">
        <SimpleGrid columns={2} spacing={4} marginTop={4}>
          <Input placeholder="Título" name="title" type="text" required />

          <Select
            value={selectedDuration}
            name="duration"
            placeholder="Duração"
            color="#999"
            onChange={(e) => setSelectedDuration(Number(e.target.value))}
            required
          >
            <option value="30" style={{ color: "#000" }}>
              30min
            </option>
            <option value="60" style={{ color: "#000" }}>
              1h
            </option>
            <option value="120" style={{ color: "#000" }}>
              2h
            </option>
          </Select>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={4} marginTop={4}>
          <div className="datePicker">
            <ReactDatePicker
              selected={selectedDate}
              onChange={(date) => {
                goToRoute(
                  `/appointments/new?date=${`${date?.getFullYear()}-${
                    date?.getMonth() ? date?.getMonth() + 1 : 99
                  }-${date?.getDate()}`}`
                );
                setSelectedDate(date);
              }}
              filterDate={filterPassedDate}
              dateFormat={"dd/MM/yyyy"}
              locale={ptBR}
              timeCaption="Horário"
              placeholderText="Escolha a data"
              name="date"
              onChangeRaw={(e) => e.preventDefault()}
              autoComplete="off"
              required
            />
          </div>
          {selectedDate !== null && (
            <div className="datePicker">
              <ReactDatePicker
                name="time"
                selected={selectedTime}
                onChange={(date) => setSelectedTime(date)}
                showTimeSelect
                showTimeSelectOnly
                excludeTimes={excludedTimes}
                timeIntervals={timeSpacing}
                timeCaption="Horário"
                filterTime={
                  selectedDateIsGreaterThanToday ? undefined : filterPassedTime
                }
                dateFormat="HH'h'mm"
                placeholderText="Escolha um horário"
                onChangeRaw={(e) => e.preventDefault()}
                required
              />
            </div>
          )}
        </SimpleGrid>

        <Button
          _hover={{ color: "#eee", opacity: 0.875 }}
          w="100%"
          marginTop="4"
          type="submit"
          bgColor="#2f2c55"
          color="#b9b6d6"
        >
          Criar
        </Button>
      </Form>
    </Container>
  );
}
