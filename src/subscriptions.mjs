// subscriptions.mjs
import { createServer } from "http";
import express from "express";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs, resolvers } from "./graphql/schema/index.js";
import { context } from "./graphql/context/index.js";

const app = express();
const httpServer = createServer(app);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

useServer({ schema, context }, wsServer);

httpServer.listen(5000, () => {
  console.log(`🔄 Subscription WS ready at ws://localhost:5000/graphql`);
});
