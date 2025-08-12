# Instruções para Corrigir o Banco de Dados

## Problema
O erro `unrecognized configuration parameter "app.empresa_id"` indica que as colunas necessárias não existem na tabela `configuracoes_empresa`.

## Solução

### 1. Execute o SQL no Supabase

1. Acesse o painel do Supabase
2. Vá para **SQL Editor**
3. Cole e execute o conteúdo do arquivo `executar_migracao_openai.sql`

### 2. O que o SQL faz:

- **Adiciona** as colunas necessárias:
  - `openai_api_key` (TEXT)
  - `openai_agent_id` (TEXT)

- **Remove** colunas desnecessárias:
  - `openai_agent_instructions`
  - `openai_model`

- **Verifica** se tudo foi criado corretamente

### 3. Após executar o SQL:

1. Recarregue a página de configurações
2. Tente testar a API Key e o agente novamente

### 4. Estrutura final da tabela:

A tabela `configuracoes_empresa` terá apenas as colunas essenciais:
- `id`
- `empresa_id`
- `feature_chat_ia`
- `feature_roleplay`
- `feature_pdi`
- `feature_dashboard`
- `feature_base_conhecimento`
- `feature_mentor_voz`
- `openai_api_key` ← **NOVA**
- `openai_agent_id` ← **NOVA**
- `elevenlabs_api_key`
- `created_at`
- `updated_at`

## Resultado Esperado

Após executar o SQL, você deve conseguir:
- ✅ Carregar a página de configurações sem erros
- ✅ Salvar a API Key da OpenAI
- ✅ Salvar o ID do agente
- ✅ Testar a conexão com o agente
