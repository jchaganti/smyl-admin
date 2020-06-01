import gql from 'graphql-tag';


export const signUpMutation = gql`mutation ($firstName: String!, $lastName: String!, $email: String!, $role:String!){
  signUp( firstName:$firstName, lastName:$lastName, email: $email, role:$role){
    id,
    firstName,
    lastName,
    email,
    role,
    verificationStatus
  }
}`;

export const signInMutation = gql`mutation ($email: String!, $password:String!){
  signIn( email: $email, password:$password){
   token
  }
}`;

export const createRetailerMutation = gql`mutation ($name: String!, $categories:[String!]!,) {
  createRetailer(name: $name, categories:$categories){
    status,
    error
  }
}`;

export const addCashbackMutation = gql`mutation ($retailerId: ID!, $category: String!, $cashbackPercent: Float!,) {
  addCashback(retailerId: $retailerId, category:$category, cashbackPercent: $cashbackPercent ){
    status,
    error
  }
}`;

export const assignRetailerToCuratorMutation = gql`mutation ($curatorId: String!, $retailerId: String!,) {
  assignRetailerToCurator(curatorId: $curatorId, retailerId:$retailerId){
    status,
    error
  }
}`;

export const unassignRetailerToCuratorMutation = gql`mutation ($curatorId: String!, $retailerId: String!,) {
  unassignRetailerToCurator(curatorId: $curatorId, retailerId:$retailerId){
    status,
    error
  }
}`;

export const deleteUserMutation = gql`mutation ($id: ID!) {
  deleteUser(id: $id){
    status,
    error
  }
}`;
