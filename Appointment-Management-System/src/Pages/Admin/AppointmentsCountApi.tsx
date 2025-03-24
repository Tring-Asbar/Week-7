import { gql } from "@apollo/client";

export const get_Appointments_Count = gql`
query GetAppointmentsCount{
    getAppointmentsCount{
        count
    }
}
`;