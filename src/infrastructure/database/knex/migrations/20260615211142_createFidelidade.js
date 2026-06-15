exports.up = knex => {
  return knex.schema.createTable("fidelidade", table => {
    table.increments("id")
    table.integer("cliente_id").notNullable().unique()
      .references("id").inTable("usuarios").onDelete("CASCADE")
    table.integer("pontos").notNullable().defaultTo(0)
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

exports.down = knex => {
  return knex.schema.dropTable("fidelidade")
}
