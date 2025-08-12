-- Verificar se a tabela configuracoes_empresa existe
-- Execute este SQL no Supabase SQL Editor

-- 1. Verificar se a tabela existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'configuracoes_empresa'
);

-- 2. Se a tabela não existir, criar ela
CREATE TABLE IF NOT EXISTS configuracoes_empresa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    feature_chat_ia BOOLEAN DEFAULT true,
    feature_roleplay BOOLEAN DEFAULT true,
    feature_pdi BOOLEAN DEFAULT true,
    feature_dashboard BOOLEAN DEFAULT true,
    feature_base_conhecimento BOOLEAN DEFAULT true,
    feature_mentor_voz BOOLEAN DEFAULT true,
    openai_api_key TEXT,
    openai_agent_id TEXT,
    openai_agent_instructions TEXT,
    openai_model TEXT DEFAULT 'gpt-4-turbo-preview',
    elevenlabs_api_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(empresa_id)
);

-- 3. Verificar se as colunas OpenAI existem
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'configuracoes_empresa' 
AND column_name IN ('openai_api_key', 'openai_agent_id', 'openai_agent_instructions', 'openai_model')
ORDER BY column_name;

-- 4. Se as colunas não existirem, adicionar elas
ALTER TABLE configuracoes_empresa 
ADD COLUMN IF NOT EXISTS openai_api_key TEXT,
ADD COLUMN IF NOT EXISTS openai_agent_id TEXT,
ADD COLUMN IF NOT EXISTS openai_agent_instructions TEXT,
ADD COLUMN IF NOT EXISTS openai_model TEXT DEFAULT 'gpt-4-turbo-preview';

-- 5. Verificar se há configurações para empresas existentes
SELECT e.nome as empresa_nome, 
       CASE WHEN c.id IS NULL THEN 'NÃO TEM' ELSE 'TEM' END as tem_configuracao
FROM empresas e
LEFT JOIN configuracoes_empresa c ON e.id = c.empresa_id
ORDER BY e.nome;

-- 6. Criar configurações padrão para empresas que não têm
INSERT INTO configuracoes_empresa (empresa_id, feature_chat_ia, feature_roleplay, feature_pdi, feature_dashboard, feature_base_conhecimento, feature_mentor_voz, openai_api_key, openai_agent_id, openai_agent_instructions, openai_model, elevenlabs_api_key)
SELECT 
    e.id,
    true, true, true, true, true, true,
    NULL, NULL, NULL, 'gpt-4-turbo-preview', NULL
FROM empresas e
WHERE NOT EXISTS (
    SELECT 1 FROM configuracoes_empresa c WHERE c.empresa_id = e.id
);
