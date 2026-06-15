exports.up = knex => {
  return knex.schema.createTable("movimentacoes_estoque", table => {
    table.increments("id")
    table.integer("estoque_id").notNullable()
      .references("id").inTable("estoque").onDelete("CASCADE")
    table.string("tipo").notNullable()
    table.integer("quantidade").notNullable()
    table.string("motivo")
    table.timestamp("created_at").defaultTo(knex.fn.now())
  })
}

exports.down = knex => {
  return knex.schema.dropTable("movimentacoes_estoque")
}