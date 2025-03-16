import { gql } from "@apollo/client";

export const create_User = gql`
  mutation CreateUser($user_name: String!, $user_email: String!, $user_phone: String!, $user_password: String!, $user_role: String!) {
    createUser(user_name: $user_name, user_email: $user_email, user_phone: $user_phone, user_password: $user_password, user_role: $user_role) {
      user_name
      user_email
      user_phone
      user_password
      user_role
    }
  }
`;
