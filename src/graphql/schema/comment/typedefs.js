import { gql } from "apollo-server";

export const commentTypedefs = gql`
  type Comment {
    id: ID!
    comment: String!
    user: User!
    createdAt: String!
  }

  extend type Query {
    comments: [Comment!]!
  }

  extend type Mutation {
    createComment(data: CreatedCommentInput!): Comment!
  }

  extend type Subscription {
    createdComment: Comment!
  }

  input CreatedCommentInput {
    comment: String!
    postId: String!
  }
`;
