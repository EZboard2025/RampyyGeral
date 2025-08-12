-- Forçar inserção dos usuários da Template
-- Execute este SQL no Supabase

-- Primeiro, vamos deletar os usuários existentes (se houver)
DELETE FROM usuarios 
WHERE email IN ('admin@template.com', 'dev@template.com')
AND empresa_id = (SELECT id FROM empresas WHERE nome = 'Template');

-- Agora vamos inserir os usuários novamente
INSERT INTO usuarios (empresa_id, nome, email, senha_hash, tipo, ativo) 
VALUES 
  ((SELECT id FROM empresas WHERE nome = 'Template'), 'Admin Template', 'admin@template.com', '123456', 'gestor', true),
  ((SELECT id FROM empresas WHERE nome = 'Template'), 'Dev Template', 'dev@template.com', '123456', 'funcionario', true);

-- Verificar se foram inseridos corretamente
SELECT 
  id, 
  nome, 
  email, 
  tipo, 
  senha_hash, 
  ativo,
  empresa_id
FROM usuarios 
WHERE empresa_id = (SELECT id FROM empresas WHERE nome = 'Template')
ORDER BY tipo, nome;
