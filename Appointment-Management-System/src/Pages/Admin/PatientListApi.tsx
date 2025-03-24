import { gql } from "@apollo/client";

export const get_Patient_Users = gql`
  query GetPatientUsers{
      getPatientUsers{
        user_name,user_email,user_phone,user_password,user_role
      }
  }
`;