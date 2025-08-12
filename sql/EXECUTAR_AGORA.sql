-- EXECUTE ESTE SQL AGORA NO SUPABASE
-- Copie e cole no SQL Editor do Supabase

-- Adicionar colunas necessárias
ALTER TABLE configuracoes_empresa ADD COLUMN IF NOT EXISTS openai_api_key TEXT;
ALTER TABLE configuracoes_empresa ADD COLUMN IF NOT EXISTS openai_agent_id TEXT;

-- Verificar se funcionou
SELECT 'COLUNAS ADICIONADAS COM SUCESSO!' as resultado;
