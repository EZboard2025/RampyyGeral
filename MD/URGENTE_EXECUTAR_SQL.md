# 🚨 URGENTE: EXECUTE O SQL AGORA!

## O Problema
O site está dando "Internal Server Error" porque as colunas necessárias não existem no banco de dados.

## SOLUÇÃO IMEDIATA (1 minuto)

### 1. Abra o Supabase
- Vá para https://supabase.com
- Faça login na sua conta
- Acesse o projeto

### 2. Execute o SQL
- Clique em **SQL Editor** (no menu lateral)
- Cole este código:

```sql
ALTER TABLE configuracoes_empresa ADD COLUMN IF NOT EXISTS openai_api_key TEXT;
ALTER TABLE configuracoes_empresa ADD COLUMN IF NOT EXISTS openai_agent_id TEXT;
```

- Clique em **RUN** (botão azul)

### 3. Verifique se funcionou
Você deve ver: "COLUNAS ADICIONADAS COM SUCESSO!"

### 4. Recarregue o site
- Volte para o seu site
- Pressione **F5** para recarregar
- O erro deve desaparecer

## Se ainda der erro:

1. **Confirme que o SQL foi executado com sucesso**
2. **Aguarde 30 segundos** (às vezes demora um pouco)
3. **Recarregue a página novamente**

## Arquivos prontos:

- `EXECUTAR_AGORA.sql` - Script SQL pronto para copiar
- `SOLUCAO_RAPIDA.sql` - Script mais completo

**EXECUTE O SQL AGORA E O PROBLEMA SERÁ RESOLVIDO!**
