import { knex } from "../../knex/index.js";
import data from "../../../db.json" with { type: "json" };
import { dateISOtoPostgres } from "./data-iso-to-postgres.js";

const commentsForDb = data.comments.map((comment) => {
  return {
    comment: comment.comment,
    user_id: comment.userId,
    post_id: comment.postId,
    created_at: dateISOtoPostgres(comment.createdAt),
  };
});

knex("comments")
  .insert(commentsForDb)
  .then((r) => {
    console.log(r);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    knex.destroy();
  });
