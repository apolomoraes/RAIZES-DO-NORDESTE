exports.up = knex => {
  return knex.schema.createTable("usuarios", table => {
    table.increments("id")
    table.string("nome").notNullable()
    table.string("email").notNullable().unique()
    table.string("password").notNullable()
    table.string("role").notNullable().defaultTo("cliente")
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

exports.down = knex => {
  return knex.schema.dropTable("usuarios")
}