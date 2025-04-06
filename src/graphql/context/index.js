import jwt from "jsonwebtoken";
import { UsersApi } from "../schema/user/datasources.js";

export const context = async ({ req, res }) => {
  let loggedUserId = await authorizeUserWithBearerToken(req);
  // console.log("loggedUserId: ", loggedUserId);
  // console.log("req.headers.cookie: ", req.headers.cookie);
  if (!loggedUserId) {
    if (req.headers.cookie) {
      const { jwtToken } = cookieParser(req.headers.cookie);
      loggedUserId = await verifyJwtToken(jwtToken);
    }
  }

  return {
    loggedUserId,
    res,
  };
};

const verifyJwtToken = async (token) => {
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const userApi = new UsersApi();
    userApi.initialize({});
    const foundUser = await userApi.getUser(userId);

    if (foundUser.token !== token) {
      return "";
    }

    return userId;
  } catch (e) {
    return "";
  }
};

const cookieParser = (cookie) => {
  if (typeof cookie !== "string") return {};

  const cookies = cookie.split(/;\s*/);

  const parsedCookie = {};

  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].split("=");
    parsedCookie[key] = decodeURIComponent(value);
  }

  return JSON.parse(JSON.stringify(parsedCookie));
};

const authorizeUserWithBearerToken = async (req) => {
  const { headers } = req;
  const { authorization } = headers;

  try {
    const [_bearer, token] = authorization.split(" ");
    return await verifyJwtToken(token);
  } catch (e) {
    // console.log("Error: ", e);
    return "";
  }
};
