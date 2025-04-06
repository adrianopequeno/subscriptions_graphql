import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RESTDataSource } from "apollo-datasource-rest";
import { AuthenticationError } from "apollo-server";

export class LoginApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.API_URL + "users";
    // this.jwt_secret = process.env.JWT_SECRET;
  }

  async login(userName, password) {
    const user = await this.getUser(userName);

    const { passwordHash, id: userId } = user[0];
    const isPasswordValid = await this.checkUserPassword(
      password,
      passwordHash
    );

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid password!");
    }

    const token = this.createJwtToken({ userId });
    await this.patch(userId, { token }, { cacheOptions: { ttl: 0 } });

    // Response Header
    /** https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Cookies */
    this.context.res.cookie("jwtToken", token, {
      secure: true, // Rede segura - Https +, em PRD configurar como true
      httpOnly: true, // Não deve ser acessado via código
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
      path: "/", // Caminho que o cookie pode ser acessado
      sameSite: "none", // strict, lax e none
    });

    return { userId, token };
  }

  async logout(userName) {
    const user = await this.getUser(userName);

    if (user[0].id !== this.context.loggedUserId) {
      throw new AuthenticationError("You can only logout your own account!");
    }

    await this.patch(user[0].id, { token: " " }, { cacheOptions: { ttl: 0 } });
    this.context.res.clearCookie("jwtToken");
    return true;
  }

  async getUser(userName) {
    const user = await this.get("", { userName }, { cacheOptions: { ttl: 0 } });
    const found = !!user.length;

    if (!found) {
      throw new AuthenticationError("User does not exist.");
    }
    return user;
  }

  checkUserPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }

  createJwtToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  }
}
