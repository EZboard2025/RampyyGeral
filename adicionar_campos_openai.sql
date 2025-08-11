-- Adicionar campos para integração com OpenAI
-- Execute este SQL no Supabase

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

-- Verificar configurações atuais
SELECT 
  e.nome as empresa,
  c.openai_api_key IS NOT NULL as tem_api_key,
  c.openai_agent_id IS NOT NULL as tem_agente,
  c.openai_agent_instructions IS NOT NULL as tem_instrucoes,
  c.openai_model as modelo
FROM empresas e
JOIN configuracoes_empresa c ON e.id = c.empresa_id
ORDER BY e.nome;
