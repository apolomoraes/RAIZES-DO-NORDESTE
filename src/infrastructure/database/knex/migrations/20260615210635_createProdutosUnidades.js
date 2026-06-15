exports.up = knex => {
  return knex.schema.createTable("produtos_unidades", table => {
    table.increments("id")
    table.integer("produto_id").notNullable()
      .references("id").inTable("produtos").onDelete("CASCADE")
    table.integer("unidade_id").notNullable()
      .references("id").inTable("unidades").onDelete("CASCADE")
    table.boolean("disponivel").notNullable().defaultTo(true)
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())

    table.unique(["produto_id", "unidade_id"])
  })
}

exports.down = knex => {
  return knex.schema.dropTable("produtos_unidades")
}