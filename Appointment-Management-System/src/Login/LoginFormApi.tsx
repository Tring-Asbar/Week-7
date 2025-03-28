import { gql } from "@apollo/client";

export const get_User_By_Email = gql`
  query GetUserByEmail($user_email: String!) {
    getUserByEmail(user_email: $user_email) {
      user_name
      user_email
      user_password
      user_role
    }
  }
`;

export const login_user = gql`
  mutation LoginUser($input:loginDetails){
    login(input:$input){
      token
      role
      name
    }
  }
`