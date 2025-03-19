import { gql } from "@apollo/client";

export const APPROVE_APPOINTMENT = gql`
  mutation ApproveAppointment($patient_email: String!, $patient_name: String!) {
    approveAppointment(patient_email: $patient_email, patient_name: $patient_name) {
      success
      message
    }
  }
`;