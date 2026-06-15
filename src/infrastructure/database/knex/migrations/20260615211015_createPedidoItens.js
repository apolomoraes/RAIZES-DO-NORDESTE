exports.up = knex => {
  return knex.schema.createTable("pedido_itens", table => {
    table.increments("id")
    table.integer("pedido_id").notNullable()
      .references("id").inTable("pedidos").onDelete("CASCADE")
    table.integer("produto_id").notNullable()
      .references("id").inTable("produtos").onDelete("RESTRICT")
    table.integer("quantidade").notNullable()
    table.decimal("preco_unitario", 10, 2).notNullable()
  })
}

exports.down = knex => {
  return knex.schema.dropTable("pedido_itens")
}
