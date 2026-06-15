exports.up = knex => {
  return knex.schema.createTable("produtos", table => {
    table.increments("id")
    table.string("nome").notNullable()
    table.text("descricao")
    table.decimal("preco", 10, 2).notNullable()
    table.string("categoria").notNullable()
    table.boolean("disponivel_junino").notNullable().defaultTo(false)
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

exports.down = knex => {
  return knex.schema.dropTable("produtos")
}
