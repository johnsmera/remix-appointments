import type { Appointment } from "~/interfaces/Appointment";
import { SupabaseClient } from "@supabase/supabase-js";
import { supaClient } from "~/frameworks/supabase/Supabase";

import type {
  CreateAppointmentInput,
  ListAppointmentsInput,
  ListDateOutput,
} from "./IAppointments";

class AppointmentsService {
  constructor(private readonly supaClient: SupabaseClient) {}

  async listAppointments(input: ListAppointmentsInput): Promise<Appointment[]> {
    return this.supaClient
      .from<Appointment>("appointments")
      .select()
      .order(input.sort || "start_date", {
        ascending: input.sortType === "asc",
      })
      .then((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        if (!response.data) {
          throw new Error("No appointments found");
        }

        return response.data.filter((appointment) => appointment.start_time);
      });
  }

  async createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
    return this.supaClient
      .from<Appointment>("appointments")
      .insert([
        {
          title: input.title,
          start_time: input.startTime,
          end_time: input.endTime,
        },
      ])
      .then((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        if (!response.data) {
          throw new Error("No appointment created");
        }

        return Array.isArray(response.data) ? response.data[0] : response.data;
      });
  }

  async deleteAppointment(appointment_id: number): Promise<boolean> {
    return this.supaClient
      .from<Appointment>("appointments")
      .delete()
      .match({ id: appointment_id })
      .then((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        if (!response.data) {
          throw new Error("No appointments found");
        }

        return typeof response.data === "boolean" ? response.data : false;
      });
  }

  async listDate(date: Date): Promise<ListDateOutput[]> {
    const startLocale = new Date(date.setUTCHours(0, 0, 0, 0)).toISOString();
    const endLocale = new Date(date.setUTCHours(23, 59, 59, 999)).toISOString();

    return this.supaClient
      .from<Appointment>("appointments")
      .select("start_time, end_time")
      .gte("start_time", startLocale)
      .lt("end_time", endLocale)
      .then((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        if (!response.data) {
          throw new Error("No appointments found");
        }

        const output: ListDateOutput[] = [];

        for (let i = 0; i < response.data.length; i++) {
          // refactor -> use pipe streams instead for
          const item = response.data[i];
          output.push({
            startTime: String(item.start_time),
            endTime: String(item.end_time),
          });
        }

        return output;
      });
  }
}

export const appointmentsService = new AppointmentsService(supaClient);
