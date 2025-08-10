-- Verificar se os usuários da Template existem
-- Execute este SQL no Supabase para garantir que os usuários estejam criados

-- Primeiro, vamos verificar se a empresa Template existe
SELECT id, nome FROM empresas WHERE nome = 'Template';

-- Depois, vamos verificar se os usuários existem
SELECT id, nome, email, tipo, ativo 
FROM usuarios 
WHERE empresa_id = (SELECT id FROM empresas WHERE nome = 'Template');

-- Se os usuários não existirem, vamos criá-los
-- (Substitua 'template-id' pelo ID real da empresa Template)

INSERT INTO usuarios (empresa_id, nome, email, senha, tipo, ativo) 
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

INSERT INTO usuarios (empresa_id, nome, email, senha, tipo, ativo) 
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

-- Verificar novamente após a inserção
SELECT id, nome, email, tipo, ativo 
FROM usuarios 
WHERE empresa_id = (SELECT id FROM empresas WHERE nome = 'Template')
ORDER BY tipo, nome;
