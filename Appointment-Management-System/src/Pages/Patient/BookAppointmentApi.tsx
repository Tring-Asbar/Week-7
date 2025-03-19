import { gql } from "@apollo/client";

export const book_Appointment = gql`
  mutation BookAppointment($input:bookingDetails) {
    bookAppointment(input:$input) {
      patient_name
      patient_email
      patient_location
      patient_disease
      patient_selecteddoctors
      patient_appointmenttime
      applicant_name
    }
  }
`;