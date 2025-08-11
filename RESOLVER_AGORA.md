# 🚨 RESOLVER INTERNAL SERVER ERROR AGORA

## O Problema
Você está vendo "Internal Server Error" porque as colunas `openai_api_key` e `openai_agent_id` não existem no banco de dados.

## Solução Imediata (2 minutos)

### 1. Execute o SQL Rápido

1. **Abra o painel do Supabase**
2. **Vá para SQL Editor**
3. **Cole este código e execute:**

```sql
-- SOLUÇÃO RÁPIDA
ALTER TABLE configuracoes_empresa 
ADD COLUMN IF NOT EXISTS openai_api_key TEXT,
ADD COLUMN IF NOT EXISTS openai_agent_id TEXT;
```

### 2. Ou use o arquivo completo

Se preferir, use o arquivo `SOLUCAO_RAPIDA.sql` que já está pronto.

### 3. Após executar

1. **Recarregue a página** (F5)
2. **O erro deve desaparecer**
3. **Teste acessar a página de configurações**

## Se ainda der erro:

1. **Verifique se o SQL foi executado com sucesso**
2. **Confirme que apareceu "SUCESSO! Colunas adicionadas"**
3. **Recarregue a página novamente**

## Estrutura que será criada:

```
configuracoes_empresa:
├── openai_api_key ← NOVA
└── openai_agent_id ← NOVA
```

**Execute o SQL AGORA e o problema será resolvido!**
