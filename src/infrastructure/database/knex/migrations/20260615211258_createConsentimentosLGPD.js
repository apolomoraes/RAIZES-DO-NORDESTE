exports.up = knex => {
  return knex.schema.createTable("consentimentos_lgpd", table => {
    table.increments("id")
    table.integer("cliente_id").notNullable()
      .references("id").inTable("usuarios").onDelete("CASCADE")
    table.string("finalidade").notNullable() // ex: programa_fidelidade, marketing
    table.boolean("aceito").notNullable().defaultTo(false)
    table.timestamp("created_at").defaultTo(knex.fn.now())
  })
}

exports.down = knex => {
  return knex.schema.dropTable("consentimentos_lgpd")
}
