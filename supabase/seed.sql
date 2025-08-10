-- Script para inserir dados de teste
-- Execute este script após criar as tabelas

-- Inserir usuários de teste para cada empresa
INSERT INTO usuarios (empresa_id, email, nome, cargo, tipo, senha_hash, ativo) VALUES
-- TechCorp
((SELECT id FROM empresas WHERE nome = 'TechCorp'), 'admin@techcorp.com', 'Administrador TechCorp', 'CEO', 'gestor', 'hash_senha_123456', true),
((SELECT id FROM empresas WHERE nome = 'TechCorp'), 'joao@techcorp.com', 'João Silva', 'Vendedor', 'funcionario', 'hash_senha_123456', true),
((SELECT id FROM empresas WHERE nome = 'TechCorp'), 'maria@techcorp.com', 'Maria Santos', 'Vendedora', 'funcionario', 'hash_senha_123456', true),

-- SalesPro
((SELECT id FROM empresas WHERE nome = 'SalesPro'), 'admin@salespro.com', 'Administrador SalesPro', 'Diretor', 'gestor', 'hash_senha_123456', true),
((SELECT id FROM empresas WHERE nome = 'SalesPro'), 'pedro@salespro.com', 'Pedro Costa', 'Vendedor', 'funcionario', 'hash_senha_123456', true),
((SELECT id FROM empresas WHERE nome = 'SalesPro'), 'ana@salespro.com', 'Ana Oliveira', 'Vendedora', 'funcionario', 'hash_senha_123456', true),

-- InnovateLab
((SELECT id FROM empresas WHERE nome = 'InnovateLab'), 'admin@innovatelab.com', 'Administrador InnovateLab', 'Fundador', 'gestor', 'hash_senha_123456', true),
((SELECT id FROM empresas WHERE nome = 'InnovateLab'), 'carlos@innovatelab.com', 'Carlos Lima', 'Vendedor', 'funcionario', 'hash_senha_123456', true),
((SELECT id FROM empresas WHERE nome = 'InnovateLab'), 'julia@innovatelab.com', 'Julia Ferreira', 'Vendedora', 'funcionario', 'hash_senha_123456', true);

-- Inserir vendas de exemplo
INSERT INTO vendas (empresa_id, funcionario_id, valor, data_venda, status, observacoes) VALUES
-- Vendas TechCorp
((SELECT id FROM empresas WHERE nome = 'TechCorp'), 
 (SELECT id FROM usuarios WHERE email = 'joao@techcorp.com'), 
 15000.00, '2024-01-15', 'concluida', 'Venda de software empresarial'),
((SELECT id FROM empresas WHERE nome = 'TechCorp'), 
 (SELECT id FROM usuarios WHERE email = 'maria@techcorp.com'), 
 8500.00, '2024-01-16', 'concluida', 'Venda de licenças'),

-- Vendas SalesPro
((SELECT id FROM empresas WHERE nome = 'SalesPro'), 
 (SELECT id FROM usuarios WHERE email = 'pedro@salespro.com'), 
 22000.00, '2024-01-15', 'concluida', 'Venda de consultoria'),
((SELECT id FROM empresas WHERE nome = 'SalesPro'), 
 (SELECT id FROM usuarios WHERE email = 'ana@salespro.com'), 
 12000.00, '2024-01-16', 'concluida', 'Venda de treinamento'),

-- Vendas InnovateLab
((SELECT id FROM empresas WHERE nome = 'InnovateLab'), 
 (SELECT id FROM usuarios WHERE email = 'carlos@innovatelab.com'), 
 18000.00, '2024-01-15', 'concluida', 'Venda de inovação'),
((SELECT id FROM empresas WHERE nome = 'InnovateLab'), 
 (SELECT id FROM usuarios WHERE email = 'julia@innovatelab.com'), 
 9500.00, '2024-01-16', 'concluida', 'Venda de pesquisa');

-- Inserir base de conhecimento
INSERT INTO base_conhecimento (empresa_id, titulo, conteudo, categoria, tags) VALUES
-- TechCorp
((SELECT id FROM empresas WHERE nome = 'TechCorp'), 
 'Como vender software empresarial', 
 'Guia completo para venda de software empresarial, incluindo técnicas de prospecção, demonstração e fechamento.', 
 'Vendas', 
 ARRAY['software', 'empresarial', 'vendas']),

-- SalesPro
((SELECT id FROM empresas WHERE nome = 'SalesPro'), 
 'Técnicas de consultoria em vendas', 
 'Metodologias e técnicas para venda de serviços de consultoria, incluindo diagnóstico e proposta de valor.', 
 'Consultoria', 
 ARRAY['consultoria', 'serviços', 'diagnóstico']),

-- InnovateLab
((SELECT id FROM empresas WHERE nome = 'InnovateLab'), 
 'Vendendo inovação', 
 'Como comunicar e vender projetos de inovação, destacando o valor e ROI para o cliente.', 
 'Inovação', 
 ARRAY['inovação', 'projetos', 'ROI']);

-- Inserir PDIs de exemplo
INSERT INTO pdi (empresa_id, funcionario_id, titulo, descricao, objetivos, prazo, status) VALUES
-- PDI TechCorp
((SELECT id FROM empresas WHERE nome = 'TechCorp'),
 (SELECT id FROM usuarios WHERE email = 'joao@techcorp.com'),
 'Desenvolvimento de habilidades técnicas',
 'Melhorar conhecimento técnico para venda de software',
 '["Aprender 3 novos produtos", "Fazer 5 demonstrações", "Fechar 2 vendas técnicas"]',
 '2024-03-15',
 'em_andamento'),

-- PDI SalesPro
((SELECT id FROM empresas WHERE nome = 'SalesPro'),
 (SELECT id FROM usuarios WHERE email = 'pedro@salespro.com'),
 'Especialização em consultoria',
 'Desenvolver expertise em vendas de consultoria',
 '["Completar curso de consultoria", "Participar de 3 projetos", "Mentorar 1 vendedor"]',
 '2024-04-01',
 'em_andamento'),

-- PDI InnovateLab
((SELECT id FROM empresas WHERE nome = 'InnovateLab'),
 (SELECT id FROM usuarios WHERE email = 'carlos@innovatelab.com'),
 'Liderança em inovação',
 'Desenvolver habilidades de liderança em projetos inovadores',
 '["Liderar 2 projetos", "Treinar equipe", "Criar metodologia"]',
 '2024-05-01',
 'em_andamento');

-- Inserir avaliações de exemplo
INSERT INTO avaliacoes (empresa_id, funcionario_id, tipo, pontuacao, feedback, criterios) VALUES
-- Avaliações TechCorp
((SELECT id FROM empresas WHERE nome = 'TechCorp'),
 (SELECT id FROM usuarios WHERE email = 'joao@techcorp.com'),
 'roleplay',
 85,
 'Excelente conhecimento técnico, precisa melhorar fechamento',
 '{"conhecimento_tecnico": 90, "comunicacao": 80, "fechamento": 75}'),

-- Avaliações SalesPro
((SELECT id FROM empresas WHERE nome = 'SalesPro'),
 (SELECT id FROM usuarios WHERE email = 'pedro@salespro.com'),
 'pdi',
 92,
 'Ótimo desenvolvimento, metas atingidas com sucesso',
 '{"objetivos_atingidos": 95, "comprometimento": 90, "resultados": 90}'),

-- Avaliações InnovateLab
((SELECT id FROM empresas WHERE nome = 'InnovateLab'),
 (SELECT id FROM usuarios WHERE email = 'carlos@innovatelab.com'),
 'mentor',
 88,
 'Boa criatividade, precisa estruturar melhor as propostas',
 '{"criatividade": 95, "estrutura": 80, "apresentacao": 85}');
