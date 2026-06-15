exports.up = knex => {
  return knex.schema.createTable("unidades", table => {
    table.increments("id")
    table.string("nome").notNullable()
    table.string("endereco").notNullable()
    table.string("cidade").notNullable()
    table.string("estado").notNullable()
    table.string("tipo").notNullable().defaultTo("completa")
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

exports.down = knex => {
  return knex.schema.dropTable("unidades")
}