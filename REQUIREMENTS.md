# 📘 Business Rules — Desafio de Alta Performance

Este documento descreve **todas as regras de negócio** que regem o projeto.  
O objetivo é definir _claramente_ o comportamento esperado do sistema, garantindo consistência, previsibilidade e alta performance mesmo sob carga pesada.

---

# 📦 Domínio: Catálogo + Vendas de Produtos

O sistema simula um pequeno módulo de **catálogo de produtos** e **registro de vendas**, com restrições suficientes para forçar otimizações, controle de concorrência, cache e mecanismos de busca eficientes.

---

# 1. 🛍️ Produto

Cada produto possui:

- `id` (UUID)
- `nome` (obrigatório)
- `descricao`
- `categoria`
- `preco` (decimal; obrigatório; >= 0)
- `estoque` (inteiro; >= 0)
- `tags` (array de strings)
- `createdAt`
- `updatedAt`

### Regras:

1. Não é permitido criar produtos sem `nome` ou `preco`.
2. `estoque` sempre deve ser >= 0.
3. Alterações em `nome`, `descricao`, `tags` e `categoria` devem refletir no índice de busca.
4. Atualizações em estoque via atualização manual são proibidas — somente por eventos de venda.
5. `preco` não pode ser negativo.

---

# 2. 🔎 Busca por Produtos (via Elasticsearch)

A busca deve ser **rápida**, **relevante** e **escalável**.

### Regras:

1. Toda busca textual (nome/descrição/tags) **deve utilizar Elasticsearch**.
2. Filtros permitidos:
   - categoria
   - faixa de preço
   - tags
3. Suporte para ordenação por:
   - `preco`
   - `createdAt`
   - `relevancia`
4. Paginação:
   - recomendado: **cursor-based**
   - permitido: offset/limit (mas pode degradar performance)
5. Resultados devem retornar:
   - total de itens
   - página atual ou cursor
   - itens por página

---

# 3. 💳 Venda

A venda envolve validação, consistência de estoque e registro histórico.

### Campos de Registro de Venda:

- `id` (UUID)
- `productId`
- `quantity`
- `priceAtSale`
- `buyerId` (opcional)
- `createdAt`

### Regras:

1. O produto deve existir.
2. `quantity > 0`.
3. Antes da venda, é obrigatório validar:
   - `estoque >= quantity`.
4. A atualização do estoque deve ocorrer:
   - dentro de uma **transação atômica**, ou
   - usando controle otimista/pessimista de concorrência.
5. **Oversell é proibido**, mesmo sob alta concorrência.
6. A operação deve ser **idempotente** quando receber `Idempotency-Key`.
7. A resposta para estoque insuficiente é:
   - `409 Conflict` + mensagem clara.
8. Cada venda gera um registro histórico imutável.

---

# 4. 🔐 Concorrência e Consistência

O sistema deve evitar condições de corrida e inconsistência.

### Regras:

1. A atualização de estoque deve ser protegida contra concorrência.
2. É permitido usar:
   - `SELECT ... FOR UPDATE`,
   - versionamento (campo `version`),
   - ou fila (serialização).
3. Requisições simultâneas não podem gerar:
   - estoque negativo,
   - vendas duplicadas,
   - inconsistência de dados.
4. Estratégias de retry devem ser idempotentes.

---

# 5. 🚀 Cache

Cache pode ser utilizado para melhorar performance, mas deve respeitar consistência.

### Regras:

1. O cache pode armazenar:
   - buscas,
   - consultas pesadas,
   - listas,
   - filtros.
2. Não é recomendado cachear valores críticos como estoque por longos períodos.
3. O cache deve ter TTL explícito.
4. Alterações em produtos devem invalidar ou atualizar as chaves relevantes.
5. É permitido:
   - cache no front (SWR, react-query),
   - cache no backend (Redis),
   - cache por key com parâmetros (q+filters+sort+cursor).

---

# 6. 🧭 Indexação e Sincronização

### Regras:

1. Toda criação/atualização de produto deve atualizar Elasticsearch.
2. Sincronização eventual é permitida, mas:
   - deve ser documentada,
   - pode impactar busca por alguns segundos.
3. Atualizações críticas podem exigir sincronização síncrona.
4. Se o índice ficar defasado, deve existir endpoint ou worker para reindexação.

---

# 7. 🗃️ Histórico e Retenção de Dados

### Regras:

1. Registros de venda são **imutáveis**.
2. Logs e históricos podem ter política de retenção:
   - ex.: arquivar > 12 meses.
3. Não é permitido sobrescrever vendas previamente registradas.
4. IDs devem ser rastreáveis mesmo após arquivamento.

---

# 8. ⚠️ Erros, Retries e Robustez

### Regras:

1. Operações idempotentes devem aceitar retries sem causar duplicação.
2. Processos assíncronos devem ter retry com backoff exponencial.
3. Workers devem enviar mensagens problemáticas para uma **dead-letter queue**.
4. Toda falha de validação deve retornar erros claros.
5. Respostas devem ser consistentes mesmo sob carga pesada.

---

# 9. 🔁 Campos que Exigem Consistência Forte

- Estoque
- Quantidade vendida
- Idempotency-Key

Esses campos não podem ser servidos via cache de longa duração.

---

# 10. 📊 Observações de Performance

Estas regras não são obrigatórias, mas fortemente recomendadas:

- usar índices adequados no banco
- minimizar full scans
- evitar joins muito profundos
- reduzir payloads de respostas
- usar paginação eficiente
- considerar denormalização controlada para performance

---

# 📚 Final

Essas regras foram criadas para simular comportamentos reais de sistemas de grande escala, proporcionando um terreno para treino de:

- escalabilidade
- otimização
- concorrência
- consistência forte
- uso de cache e busca avançada

Se precisar gerar **diagramas**, **exemplos de endpoints**, **modelos de dados** ou **fluxos de concorrência**, posso montar tudo.  
Basta pedir.
