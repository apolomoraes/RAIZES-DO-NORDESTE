exports.up = knex => {
  return knex.schema.createTable("promocoes", table => {
    table.increments("id")
    table.string("nome").notNullable()
    table.string("tipo").notNullable() // desconto_percentual, desconto_fixo, pontos_extras
    table.decimal("valor", 10, 2).notNullable()
    table.integer("produto_id")
      .references("id").inTable("produtos").onDelete("CASCADE")
    table.integer("unidade_id")
      .references("id").inTable("unidades").onDelete("CASCADE")
    table.boolean("ativa").notNullable().defaultTo(true)
    table.date("data_inicio").notNullable()
    table.date("data_fim").notNullable()
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

exports.down = knex => {
  return knex.schema.dropTable("promocoes")
}