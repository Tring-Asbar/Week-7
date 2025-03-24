import { gql } from "@apollo/client"

export const get_Doctor_Users = gql`
  query GetDoctorUsers{
      getDoctorUsers{
        user_name,user_email,user_phone,user_password,user_role
      }
  }
`