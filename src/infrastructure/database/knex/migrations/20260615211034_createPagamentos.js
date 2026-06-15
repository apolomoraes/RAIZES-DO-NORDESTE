exports.up = knex => {
  return knex.schema.createTable("pagamentos", table => {
    table.increments("id")
    table.integer("pedido_id").notNullable()
      .references("id").inTable("pedidos").onDelete("CASCADE")
    table.string("forma_pagamento").notNullable() // MOCK
    table.string("status").notNullable().defaultTo("PENDENTE") // PENDENTE, APROVADO, RECUSADO
    table.text("payload") // JSON simulado da resposta do gateway
    table.timestamp("created_at").defaultTo(knex.fn.now())
  })
}

exports.down = knex => {
  return knex.schema.dropTable("pagamentos")
}
