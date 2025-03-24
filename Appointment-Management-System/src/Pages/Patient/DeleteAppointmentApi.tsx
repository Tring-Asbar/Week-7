import { gql } from "@apollo/client";

export const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($patient_appointmentid: Int!) {
    deleteAppointment(patient_appointmentid: $patient_appointmentid) {
      patient_appointmentid
    }
  }
`;