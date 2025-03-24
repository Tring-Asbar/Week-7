import { gql } from "@apollo/client";

export const create_User = gql`
  mutation CreateUser($input:userDetails) {
    createUser(input:$input) {
      user_name
      user_email
      user_phone
      user_password
      user_role
    }
  }
`;
