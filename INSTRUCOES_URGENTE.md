# 🚨 URGENTE: Resolver Internal Server Error

## O Problema
Você está vendo "Internal Server Error" porque as colunas necessárias não existem no banco de dados.

## Solução Imediata

### 1. Execute o SQL de Correção

**IMPORTANTE**: Você PRECISA executar o SQL agora!

1. Acesse o painel do Supabase
2. Vá para **SQL Editor**
3. Cole e execute o conteúdo do arquivo `corrigir_banco_completo.sql`

### 2. O que o SQL faz:

✅ **Verifica** se a tabela existe  
✅ **Adiciona** as colunas necessárias: `openai_api_key` e `openai_agent_id`  
✅ **Remove** colunas desnecessárias  
✅ **Cria** configurações para empresas que não têm  
✅ **Mostra** o status de tudo  

### 3. Após executar o SQL:

1. Recarregue a página de configurações
2. O erro deve desaparecer
3. Você poderá configurar a API Key e ID do agente

## Se ainda der erro:

1. Verifique se o SQL foi executado com sucesso
2. Confirme que as colunas foram criadas
3. Recarregue a página

## Estrutura Final da Tabela:

```
configuracoes_empresa:
├── id
├── empresa_id
├── feature_chat_ia
├── feature_roleplay
├── feature_pdi
├── feature_dashboard
├── feature_base_conhecimento
├── feature_mentor_voz
├── openai_api_key ← NOVA
├── openai_agent_id ← NOVA
├── elevenlabs_api_key
├── created_at
└── updated_at
```

**Execute o SQL AGORA para resolver o problema!**
