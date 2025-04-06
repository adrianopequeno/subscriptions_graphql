export async function up(knex) {
  return knex.schema.createTable('comments', (table) => {
    table.increments('id').primary();
    table.text('comment').notNullable();
    table.string('post_id', 255).notNullable();
    table.string('user_id').notNullable();
    table.timestamps(true, true);
  });
};

export async function down(knex) {
  knex.schema.dropTable('comments');
};
