import gql from 'graphql-tag';

export const getCurators = gql`query {
  curators{
   id
   role
 }
 }`;

export const getAssignedRetailers = gql`query {
  assignedRetailers{
   categories{
    }
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

