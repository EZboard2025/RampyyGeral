-- Inserir usuários da Template
-- Execute este SQL no Supabase

-- Primeiro, vamos verificar se a empresa Template existe
SELECT id, nome FROM empresas WHERE nome = 'Template';

-- Verificar se os usuários já existem
SELECT id, nome, email, tipo, ativo 
FROM usuarios 
WHERE empresa_id = (SELECT id FROM empresas WHERE nome = 'Template');

-- Inserir usuários da Template (se não existirem)
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
