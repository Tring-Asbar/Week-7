import { gql } from "@apollo/client";

export const UPDATE_APPOINTMENT = gql`
mutation UpdateAppointment($input:updateBookingDetails) {
  updateAppointment(input:$input) {
    patient_appointmentid
    patient_name
    patient_email
    patient_location
    patient_disease
    patient_selecteddoctors
    patient_appointmenttime
  }
}
`;