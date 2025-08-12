-- TESTE SIMPLES - Execute este SQL primeiro
-- Execute no Supabase SQL Editor

-- 1. Verificar se a tabela existe
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'configuracoes_empresa'
        ) THEN '✅ TABELA EXISTE'
        ELSE '❌ TABELA NÃO EXISTE'
    END as status_tabela;

-- 2. Criar tabela se não existir
CREATE TABLE IF NOT EXISTS configuracoes_empresa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    empresa_id UUID NOT NULL,
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

-- 3. Adicionar colunas OpenAI
ALTER TABLE configuracoes_empresa 
ADD COLUMN IF NOT EXISTS openai_api_key TEXT,
ADD COLUMN IF NOT EXISTS openai_agent_id TEXT,
ADD COLUMN IF NOT EXISTS openai_agent_instructions TEXT,
ADD COLUMN IF NOT EXISTS openai_model TEXT DEFAULT 'gpt-4-turbo-preview';

-- 4. Verificar se deu certo
SELECT '✅ TABELA CRIADA/ATUALIZADA COM SUCESSO!' as resultado;
