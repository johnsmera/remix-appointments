import type { Appointment } from "~/interfaces/Appointment";

export type ListAppointmentsInput = {
  title: string;

  sort: keyof Appointment;
  sortType: "asc" | "desc";
};

export type CreateAppointmentInput = {
  title: string;
  startTime: Date;
  endTime: Date;
};

export type ListDateOutput = {
  startTime: string;
  endTime: string;
};
