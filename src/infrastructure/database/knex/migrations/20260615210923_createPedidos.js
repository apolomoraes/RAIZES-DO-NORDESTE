exports.up = knex => {
  return knex.schema.createTable("pedidos", table => {
    table.increments("id")
    table.integer("cliente_id").notNullable()
      .references("id").inTable("usuarios").onDelete("CASCADE")
    table.integer("unidade_id").notNullable()
      .references("id").inTable("unidades").onDelete("CASCADE")
    table.string("canal_pedido").notNullable() // APP, TOTEM, BALCAO, PICKUP, WEB
    table.string("status").notNullable().defaultTo("AGUARDANDO_PAGAMENTO")
    table.decimal("valor_total", 10, 2).notNullable().defaultTo(0)
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

exports.down = knex => {
  return knex.schema.dropTable("pedidos")
}
