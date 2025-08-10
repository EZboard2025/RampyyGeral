-- Verificar se a coluna senha_hash existe na tabela usuarios
-- Execute este SQL no Supabase

-- Primeiro, vamos verificar a estrutura atual da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;

-- Se a coluna senha_hash não existir, vamos adicioná-la
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' 
        AND column_name = 'senha_hash'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN senha_hash VARCHAR(255) NOT NULL DEFAULT '123456';
    END IF;
END $$;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND column_name = 'senha_hash';

-- Agora podemos inserir os usuários da Template
INSERT INTO usuarios (empresa_id, nome, email, senha_hash, tipo, ativo) 
SELECT 
  (SELECT id FROM empresas WHERE nome = 'Template'),
  'Admin Template',
  'admin@template.com',
  '123456',
  'gestor',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios 
  WHERE email = 'admin@template.com' 
  AND empresa_id = (SELECT id FROM empresas WHERE nome = 'Template')
);

INSERT INTO usuarios (empresa_id, nome, email, senha_hash, tipo, ativo) 
SELECT 
  (SELECT id FROM empresas WHERE nome = 'Template'),
  'Dev Template',
  'dev@template.com',
  '123456',
  'funcionario',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios 
  WHERE email = 'dev@template.com' 
  AND empresa_id = (SELECT id FROM empresas WHERE nome = 'Template')
);

-- Verificar os usuários criados
SELECT id, nome, email, tipo, ativo 
FROM usuarios 
WHERE empresa_id = (SELECT id FROM empresas WHERE nome = 'Template')
ORDER BY tipo, nome;
