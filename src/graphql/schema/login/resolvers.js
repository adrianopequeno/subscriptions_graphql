import { checkOwner } from "./utils/login-functions.js";

export const login = async (_, { data }, { dataSources }) => {
  // console.log("dataSources", dataSources);
  const { userName, password } = data;
  return dataSources.loginApi.login(userName, password);
};

export const logout = async (_, { userName }, { dataSources }) => {
  return dataSources.loginApi.logout(userName);
};

export const loginResolvers = {
  Mutation: {
    login,
    logout,
  },
};
