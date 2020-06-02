import gql from 'graphql-tag';

export const getCurators = gql`query {
  curators{
    id
    firstName
    lastName
    retailers {
      id,
      name
    }
  }
}`;

export const getUsers = gql`query {
  users{
    id
    firstName
    lastName
    email
    role
  }
}`;

export const getAllRetailers = gql`query {
  retailers {
    id
    name
    categories {
      name
      cashbackPercent
    }
  }
}`;


export const getAssignedRetailers = gql`query {
  assignedRetailers{
      categories{
        name
    }
  }
}`;
