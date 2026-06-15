exports.up = knex => {
  return knex.schema.createTable("fidelidade_historico", table => {
    table.increments("id")
    table.integer("cliente_id").notNullable()
      .references("id").inTable("usuarios").onDelete("CASCADE")
    table.integer("pedido_id")
      .references("id").inTable("pedidos").onDelete("SET NULL")
    table.string("tipo").notNullable() // acumulo, resgate
    table.integer("pontos").notNullable()
    table.timestamp("created_at").defaultTo(knex.fn.now())
  })
}

exports.down = knex => {
  return knex.schema.dropTable("fidelidade_historico")
}
