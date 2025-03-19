import { gql } from "@apollo/client";

export const GET_APPOINTMENTS = gql`
query GetAppointments($doctor_name: String!) {
 getAppointments(doctor_name: $doctor_name) {
   patient_name
   patient_email
   patient_location
   patient_disease
   patient_selecteddoctors
 }
}
`;