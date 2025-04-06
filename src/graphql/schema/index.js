import { gql } from "apollo-server";
import { postTypeDefs } from "./post/typedefs.js";
import { postResolvers } from "./post/resolvers.js";
import { apiFiltersRersolvers } from "./api-filters/resolvers.js";
import { apiFiltersTypeDefs } from "./api-filters/typedefs.js";
import { userTypesDefs } from "./user/typedefs.js";
import { userResolvers } from "./user/resolvers.js";
import { loginTypeDefs } from "./login/typedefs.js";
import { loginResolvers } from "./login/resolvers.js";
import { commentTypedefs } from "./comment/typedefs.js";
import { commentResolvers } from "./comment/resolvers.js";

const rootType = gql`
  type Query {
    _empty: Boolean
  }
  type Mutation {
    _empty: Boolean
  }
`;

const rootResolver = {
  Query: {
    _empty: () => true,
  },
  Mutation: {
    _empty: () => true,
  },
};

export const typeDefs = [
  rootType,
  postTypeDefs,
  userTypesDefs,
  apiFiltersTypeDefs,
  loginTypeDefs,
  commentTypedefs,
];
export const resolvers = [
  rootResolver,
  postResolvers,
  userResolvers,
  apiFiltersRersolvers,
  loginResolvers,
  commentResolvers,
];
