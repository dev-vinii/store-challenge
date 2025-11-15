# 🐗 Desafio de Alta Performance

Este projeto é um **desafio de performance**, inspirado na filosofia da _Rinha de Backend_, mas voltado para treinar habilidades essenciais de um desenvolvedor Pleno/Sênior, incluindo:

- **Otimização de queries**
- **Uso de cache (frontend e backend)**
- **Filas / mensageria**
- **Indexação e buscas de alta performance**
- **Concorrência e escalabilidade**
- **Arquitetura orientada a carga**

A proposta é criar uma aplicação simples na superfície, mas que exija **soluções robustas** para performar bem sob carga real.

---

## 🎯 Objetivo

Construir um sistema capaz de lidar com **alto volume de requisições concorrentes**, mantendo:

- **baixa latência**,
- **uso eficiente de CPU e memória**,
- **consistência dos dados**,
- e **respostas determinísticas** sob stress.

O objetivo não é apenas “funcionar”, mas **performar**.

---

## 🧪 O Desafio

Você deve implementar uma API que:

- recebe requisições intensivas
- realiza leituras e escritas em banco
- mantém consistência entre operações concorrentes
- responde rápido mesmo em alta carga
- aplica estratégias reais de otimização usadas em empresas grandes

---

## 🛠️ Tecnologias Recomendadas (mas não obrigatórias)

Você pode utilizar o que quiser, mas os desafios são construídos de modo que seja vantajoso conhecer:

- **Elasticsearch** para buscas otimizadas
- **Redis** como cache ou fila
- **PostgreSQL** com índices e tuning
- **Node.js / Java / Go / Rust** ou outra linguagem de preferência
- **Docker** para orquestrar o ambiente
- **k6 / JMeter / Locust** para testes de carga

---

## ⚙️ Habilidades Treinadas

### 🔎 Otimização de Banco de Dados

- Indexação estratégica
- Uso de _query plans_
- Evitar full scans
- Bloqueios e concorrência
- Normalização vs Denormalização

### 🚀 Cache

- Cache no frontend (in-memory, react-query)
- Cache no backend (Redis, in-memory, TTLs)
- Cache de queries SQL
- Estratégias de invalidação

### 🔍 Elasticsearch

- Estrutura de índices
- Sharding & replicas
- Busca aproximada e full-text
- Paginação performática
- Heavy filters

### 🧵 Concorrência e Escalabilidade

- Locks
- Idempotência
- Retry seguro
- Balanceamento de carga
- Worker queues

---

## 📦 Entregáveis

Seu projeto deve incluir:

- **API funcionando**
- **Script de carga** (ex: k6)
- **Documentação clara** com arquitetura e tomada de decisão
- Explicação de **onde a aplicação foi otimizada**
- Métricas e resultados dos testes

---

## 📊 Métricas de Avaliação

Você deve monitorar e apresentar:

- Tempo de resposta (P50, P90, P99)
- Throughput (req/s)
- Uso de CPU e memória
- Erros sob carga
- Consistência das operações

---

## 🚀 Por que este projeto existe?

Para praticar **problemas reais de engenharia** que empresas grandes enfrentam:

- gargalos de banco
- saturação de CPU
- picos de carga
- coerência de dados
- latência imprevisível
- fila de eventos crescendo
- caches vencendo
- locks gerando contenção

---

## 📚 Inspiração

Este projeto é inspirado em conceitos presentes na **Rinha de Backend**, **benchmarks enterprise**, **tarefas de engenharia de performance** e **arquiteturas de larga escala**.
