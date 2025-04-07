import { PubSub } from "graphql-subscriptions";

import { checkIsLoggedIn } from "../login/utils/login-functions.js";

export const pubsub = new PubSub();
export const CREATED_COMMENT_TRIGGER = "CREATED_COMMENT";

const createComment = async (_, { data }, { dataSources, loggedUserId }) => {
  checkIsLoggedIn(loggedUserId);
  const { postId, comment } = data;

  await dataSources.postsApi.getPosts(postId); // retornar um erro caso não encontre o post

  return dataSources.commentDb.create({
    userId: loggedUserId,
    postId,
    comment,
  });
};

const user = async ({ user_id }, _, { dataSources }) => {
  const user = await dataSources.usersApi.batchLoadById(user_id);
  return user;
};

const createdComment = {
  subscribe: () => pubsub.asyncIterator(CREATED_COMMENT_TRIGGER),
};

export const commentResolvers = {
  Mutation: { createComment },
  Subscription: { createdComment },
  Comment: { user },
};
