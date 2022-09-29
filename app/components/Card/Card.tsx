import { ArrowForwardIcon, CalendarIcon, DeleteIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import type { Appointment } from "~/interfaces/Appointment";

type Props = {
  appointment: Appointment;
  handleDelete?: (appointment: Appointment) => void;
};

export const Card = ({ appointment, handleDelete }: Props) => {
  return (
    <Flex
      flexDirection="row"
      backgroundColor="#fefefe"
      color="#333"
      padding={4}
      borderRadius={4}
      cursor="pointer"
      _hover={{
        opacity: "0.925",
      }}
      flex={1}
      justifyContent="space-between"
      alignItems="center"
    >
      <Flex flexDirection="column">
        <Flex flexDirection="row" alignItems="center">
          <Text fontSize={16}>{appointment.title}</Text>
        </Flex>

        <Flex display="flex" fontSize={12} flexDirection="row" gap={4}>
          <Text display="flex" alignItems="center" gap={1}>
            <CalendarIcon />
            {String(format(new Date(appointment.start_time), "dd/MM/yyyy"))} -
            <strong>
              {String(format(new Date(appointment.start_time), " HH'h'mm"))}
            </strong>
            <ArrowForwardIcon fontSize={16} />
            <strong>
              {String(format(new Date(appointment.end_time), " HH'h'mm"))}
            </strong>
          </Text>
        </Flex>
      </Flex>
      {handleDelete && (
        <DeleteIcon
          onClick={() => handleDelete(appointment)}
          cursor="pointer"
          color="#333"
        />
      )}
    </Flex>
  );
};
