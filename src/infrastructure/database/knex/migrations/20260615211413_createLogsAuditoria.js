exports.up = knex => {
  return knex.schema.createTable("logs_auditoria", table => {
    table.increments("id")
    table.integer("usuario_id")
      .references("id").inTable("usuarios").onDelete("SET NULL")
    table.string("acao").notNullable() // ex: criar_pedido, atualizar_status, cancelar_pedido
    table.string("entidade").notNullable() // ex: pedido, estoque, usuario
    table.integer("entidade_id").notNullable()
    table.text("detalhes") // JSON com dados extras (ex: status anterior/novo)
    table.timestamp("created_at").defaultTo(knex.fn.now())
  })
}

exports.down = knex => {
  return knex.schema.dropTable("logs_auditoria")
}
