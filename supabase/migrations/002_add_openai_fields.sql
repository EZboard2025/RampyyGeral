-- Adicionar campos para integração com OpenAI
-- Migração 002

-- Adicionar colunas para OpenAI na tabela configuracoes_empresa
ALTER TABLE configuracoes_empresa 
ADD COLUMN IF NOT EXISTS openai_api_key TEXT,
ADD COLUMN IF NOT EXISTS openai_agent_id TEXT,
ADD COLUMN IF NOT EXISTS openai_agent_instructions TEXT,
ADD COLUMN IF NOT EXISTS openai_model TEXT DEFAULT 'gpt-4-turbo-preview';

-- Verificar se as colunas foram adicionadas
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'configuracoes_empresa' 
AND column_name IN ('openai_api_key', 'openai_agent_id', 'openai_agent_instructions', 'openai_model')
ORDER BY column_name;

-- Atualizar configurações existentes com valores padrão
UPDATE configuracoes_empresa 
SET 
  openai_api_key = NULL,
  openai_agent_id = NULL,
  openai_agent_instructions = NULL,
  openai_model = 'gpt-4-turbo-preview'
WHERE openai_api_key IS NULL;
