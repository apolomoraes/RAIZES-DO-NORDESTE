const { hash } = require("bcryptjs")

exports.seed = async function (knex) {
  await knex("logs_auditoria").del()
  await knex("consentimentos_lgpd").del()
  await knex("fidelidade_historico").del()
  await knex("fidelidade").del()
  await knex("pagamentos").del()
  await knex("pedido_itens").del()
  await knex("pedidos").del()
  await knex("movimentacoes_estoque").del()
  await knex("estoque").del()
  await knex("produtos_unidades").del()
  await knex("produtos").del()
  await knex("unidades").del()
  await knex("usuarios").del()

  await knex.raw("DELETE FROM sqlite_sequence WHERE name IN ('usuarios', 'unidades', 'produtos', 'produtos_unidades', 'estoque', 'pedidos', 'pedido_itens', 'pagamentos', 'fidelidade', 'fidelidade_historico', 'consentimentos_lgpd', 'logs_auditoria')")

  const senhaHash = await hash("123456", 8)

  await knex("usuarios").insert([
    { nome: "Admin Raízes", email: "admin@raizes.com", password: senhaHash, role: "admin" },
    { nome: "Gerente Recife", email: "gerente@raizes.com", password: senhaHash, role: "gerente" },
    { nome: "Cozinha Recife", email: "cozinha@raizes.com", password: senhaHash, role: "cozinha" },
    { nome: "Atendente Recife", email: "atendente@raizes.com", password: senhaHash, role: "atendente" },
    { nome: "João Cliente", email: "joao@email.com", password: senhaHash, role: "cliente" },
  ])

  await knex("unidades").insert([
    { nome: "Unidade Recife Centro", endereco: "Rua da Aurora, 100", cidade: "Recife", estado: "PE", tipo: "completa" },
    { nome: "Unidade Olinda", endereco: "Av. Principal, 50", cidade: "Olinda", estado: "PE", tipo: "reduzida" },
    { nome: "Unidade Fortaleza", endereco: "Av. Beira Mar, 200", cidade: "Fortaleza", estado: "CE", tipo: "completa" },
  ])

  await knex("produtos").insert([
    { nome: "Tapioca Nordestina", descricao: "Tapioca recheada com queijo coalho", preco: 12.50, categoria: "tapioca", disponivel_junino: 0 },
    { nome: "Cuscuz Recheado", descricao: "Cuscuz com ovos e charque", preco: 10.00, categoria: "cuscuz", disponivel_junino: 0 },
    { nome: "Bolo de Macaxeira", descricao: "Bolo tradicional nordestino", preco: 8.00, categoria: "bolo", disponivel_junino: 0 },
    { nome: "Suco de Cajá", descricao: "Suco natural de cajá", preco: 7.00, categoria: "bebida", disponivel_junino: 0 },
    { nome: "Milho Assado Junino", descricao: "Milho assado especial de festa junina", preco: 6.00, categoria: "junino", disponivel_junino: 1 },
  ])

  await knex("produtos_unidades").insert([
    { produto_id: 1, unidade_id: 1, disponivel: 1 },
    { produto_id: 2, unidade_id: 1, disponivel: 1 },
    { produto_id: 3, unidade_id: 1, disponivel: 1 },
    { produto_id: 4, unidade_id: 1, disponivel: 1 },
    { produto_id: 5, unidade_id: 1, disponivel: 1 },
    { produto_id: 1, unidade_id: 2, disponivel: 1 },
    { produto_id: 2, unidade_id: 2, disponivel: 1 },
    { produto_id: 4, unidade_id: 2, disponivel: 1 },
    { produto_id: 1, unidade_id: 3, disponivel: 1 },
    { produto_id: 2, unidade_id: 3, disponivel: 1 },
    { produto_id: 3, unidade_id: 3, disponivel: 1 },
    { produto_id: 4, unidade_id: 3, disponivel: 1 },
  ])

  await knex("estoque").insert([
    { produto_id: 1, unidade_id: 1, quantidade: 100 },
    { produto_id: 2, unidade_id: 1, quantidade: 80 },
    { produto_id: 3, unidade_id: 1, quantidade: 50 },
    { produto_id: 4, unidade_id: 1, quantidade: 60 },
    { produto_id: 5, unidade_id: 1, quantidade: 30 },
    { produto_id: 1, unidade_id: 2, quantidade: 50 },
    { produto_id: 2, unidade_id: 2, quantidade: 40 },
    { produto_id: 4, unidade_id: 2, quantidade: 30 },
    { produto_id: 1, unidade_id: 3, quantidade: 70 },
    { produto_id: 2, unidade_id: 3, quantidade: 60 },
    { produto_id: 3, unidade_id: 3, quantidade: 40 },
    { produto_id: 4, unidade_id: 3, quantidade: 50 },
  ])

  await knex("consentimentos_lgpd").insert([
    { cliente_id: 5, finalidade: "programa_fidelidade", aceito: 1 },
    { cliente_id: 5, finalidade: "marketing", aceito: 0 },
  ])

  console.log("Seed executado com sucesso!")
}