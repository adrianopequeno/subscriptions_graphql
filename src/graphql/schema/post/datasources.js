import { RESTDataSource } from "apollo-datasource-rest";

import { makePostDataLoader } from "./postDataLoaders.js";
import {
  createPostFn,
  deletePostFn,
  updatePostFn,
} from "./utils/post-repository.js";

export class PostsApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.API_URL + "posts";
    this.dataLoader = makePostDataLoader(this.getPosts.bind(this));
  }

  async getPosts(urlParams = {}) {
    // console.log('getPosts', urlParams);
    const response = await this.get("", urlParams, {
      cacheOptions: { ttl: 0 }, // 60seg
    });
    return response;
  }

  async getPost(id) {
    const response = await this.get(`/${id}`, undefined, {
      cacheOptions: { ttl: 0 }, // 60seg
    });
    return response;
  }

  async createPost(postData) {
    return createPostFn(postData, this);
  }

  async updatePost(postId, postData) {
    return updatePostFn(postId, postData, this);
  }

  async deletePost(postId) {
    return deletePostFn(postId, this);
  }

  batchLoadByUserId(id) {
    return this.dataLoader.load(id);
  }
}
