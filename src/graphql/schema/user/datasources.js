import { RESTDataSource } from "apollo-datasource-rest";

import { makeUserDataLoader } from "./dataloaders.js";
import {
  createUserFn,
  deleteUserFn,
  updateUserFn,
} from "./utils/user-repository.js";

export class UsersApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.API_URL + "users";
    this.dataLoader = makeUserDataLoader(this.getUsers.bind(this));
  }

  async getUsers(urlParams = {}) {
    // console.log('getUsers', urlParams);
    const response = await this.get("", urlParams, {
      cacheOptions: { ttl: 0 }, // 60seg
    });
    return response;
  }

  async getUser(id) {
    return await this.get(`/${id}`, undefined, {
      cacheOptions: { ttl: 0 }, // 60seg
    });
  }

  async createUser(userData) {
    // console.log(this);
    return createUserFn(userData, this);
  }

  async updateUser(userId, userData) {
    return updateUserFn(userId, userData, this);
  }

  async deleteUser(userId) {
    return deleteUserFn(userId, this);
  }

  batchLoadByPostId(id) {
    return this.dataLoader.load(id);
  }

  batchLoadById(id) {
    return this.dataLoader.load(id);
  }
}
