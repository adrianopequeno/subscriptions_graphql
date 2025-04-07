import { ValidationError } from "apollo-server";

import { SQLDataSource } from "../../datasources/sql/sql-datasource.js";
import { pubsub, CREATED_COMMENT_TRIGGER } from "./resolvers.js";

const commentReducer = (comment) => ({
  id: comment.id,
  comment: comment.comment,
  user_id: comment.user_id,
  createdAt: new Date(comment.created_at).toISOString(),
});

export class CommentSQLDataSource extends SQLDataSource {
  async getById(id) {
    // return this.db("comments").where({ id }).first();
    return this.db("comments").where("id", "=", id);
  }

  async getByPostId(post_id) {
    // this.db("comments").where({ post_id }).first();
    const query = this.db("comments").where("post_id", "=", post_id);
    const comments = await query;
    return comments.map((comment) => commentReducer(comment));
  }

  async create({ userId, postId, comment }) {
    const partialComment = {
      user_id: userId,
      post_id: postId,
      comment,
    };

    // const exists = await this.db('comments').where(partialComment).first();
    const exists = await this.db("comments").where(partialComment);
    if (exists.length > 0) {
      throw new ValidationError("Comment already exists");
    }

    const create = await this.db("comments")
      .insert(partialComment)
      .returning("id");

    const commentToReturn = {
      id: create[0].id,
      createdAt: new Date().toISOString(),
      ...partialComment,
    };

    pubsub.publish(CREATED_COMMENT_TRIGGER, {
      createdComment: commentToReturn,
    });

    // console.log(create[0].id);
    return commentToReturn;
  }

  async batchLoaderCallback(post_ids) {
    const query = this.db("comments").whereIn("post_id", post_ids);
    // console.log(query);
    const comments = await query;
    const filteredComments = post_ids.map((post_id) => {
      return comments
        .filter((comment) => String(comment.post_id) === String(post_id))
        .map((comment) => commentReducer(comment));
    });

    return filteredComments;
  }
}
