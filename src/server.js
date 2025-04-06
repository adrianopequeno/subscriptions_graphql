import { ApolloServer } from "apollo-server";

import { knex } from "./knex/index.js";

import { typeDefs, resolvers } from "./graphql/schema/index.js";
import { context } from "./graphql/context/index.js";
import { PostsApi } from "./graphql/schema/post/datasources.js";
import { UsersApi } from "./graphql/schema/user/datasources.js";
import { LoginApi } from "./graphql/schema/login/datasources.js";
import { CommentSQLDataSource } from "./graphql/schema/comment/datasources.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources: () => {
    return {
      postsApi: new PostsApi(),
      usersApi: new UsersApi(),
      loginApi: new LoginApi(),
      commentDb: new CommentSQLDataSource(knex),
    };
  },
  playground: {
    settings: {
      "request.credentials": "include",
      "schema.polling.enable": false,
    },
  },
  uploads: false,
  // cors: {
  //   origin: ["https://cdpn.io"], // * <- allow request from all domains, [https:domio.permitido.com]
  //   credentials: true, // <- enable credentials (cookies)
  // },
});

server.listen(4003).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
