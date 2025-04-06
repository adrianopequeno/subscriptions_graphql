import { checkIsLoggedIn } from "../login/utils/login-functions.js";
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

export const commentResolvers = {
  Mutation: { createComment },
  Comment: { user },
};
