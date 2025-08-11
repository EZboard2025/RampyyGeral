# Configuração do Chat IA com OpenAI

## Visão Geral

O Chat IA é um assistente inteligente que utiliza agentes da OpenAI para responder dúvidas específicas de cada empresa. Cada empresa terá seu próprio agente treinado com informações e contexto específicos.

## Arquivos Criados

### 1. Interface do Chat
- `app/dashboard/chat/page.tsx` - Página principal do chat
- Design moderno e responsivo
- Integração com agentes da OpenAI
- Suporte a threads de conversa

### 2. Serviço OpenAI
- `lib/openai.ts` - Serviço completo de integração
- Classe `OpenAIService` para gerenciar agentes
- Templates de instruções para diferentes empresas
- Métodos para criar, listar e deletar agentes

### 3. API Routes
- `app/api/chat/route.ts` - API para comunicação com agentes
- POST: Enviar mensagens para o agente
- GET: Listar agentes da empresa

### 4. Configurações
- `app/dashboard/configuracoes/page.tsx` - Página de configurações
- Interface para configurar API Keys
- Teste de conectividade com OpenAI

### 5. Scripts SQL
- `adicionar_campos_openai.sql` - Adiciona campos necessários no banco
- `corrigir_senhas_usuarios.sql` - Corrige senhas dos usuários
- `adicionar_usuario_dev_innovatelab.sql` - Adiciona usuário faltante

## Como Configurar

### 1. Execute os Scripts SQL

Primeiro, execute estes scripts no Supabase:

```sql
-- Corrigir senhas dos usuários
-- Execute o conteúdo de corrigir_senhas_usuarios.sql

-- Adicionar campos para OpenAI
-- Execute o conteúdo de adicionar_campos_openai.sql

-- Adicionar usuário dev@innovatelab.com
-- Execute o conteúdo de adicionar_usuario_dev_innovatelab.sql
```

### 2. Configure a API Key da OpenAI

1. Acesse o dashboard da empresa como gestor
2. Vá para "Configurações"
3. Digite sua API Key da OpenAI (formato: `sk-...`)
4. Clique em "Testar API Key" para verificar
5. Salve as configurações

### 3. Teste o Chat IA

1. Acesse o dashboard
2. Clique em "Chat IA"
3. Digite uma mensagem
4. O sistema criará automaticamente um agente para sua empresa

## Templates de Agentes

O sistema inclui templates específicos para cada empresa:

### Template (Padrão)
- Assistente geral para processos da empresa
- Ajuda com treinamentos e desenvolvimento
- Informações sobre produtos e serviços

### TechCorp
- Especializado em tecnologia e software
- Ajuda com vendas de software empresarial
- Explicações técnicas de produtos

### SalesPro
- Focado em vendas e consultoria
- Técnicas de vendas e prospecção
- Insights sobre mercado e concorrência

### InnovateLab
- Especializado em inovação e pesquisa
- Ajuda com projetos de inovação
- Insights sobre tendências tecnológicas

## Funcionalidades

### ✅ Implementado
- Interface moderna do chat
- Integração com OpenAI Assistants API
- Templates específicos por empresa
- Configuração de API Keys
- Threads de conversa persistentes
- Indicadores de digitação
- Scroll automático
- Tratamento de erros

### 🔄 Próximos Passos
- Integração com base de conhecimento
- Upload de arquivos para treinar agentes
- Histórico de conversas
- Métricas de uso
- Personalização de instruções por empresa

## Estrutura do Banco

### Novos Campos em `configuracoes_empresa`:
- `openai_api_key` - Chave da API da OpenAI
- `openai_agent_id` - ID do agente criado
- `openai_agent_instructions` - Instruções personalizadas

## Segurança

- API Keys são armazenadas de forma segura no banco
- Acesso restrito apenas para gestores
- Validação de permissões em todas as rotas
- Tratamento seguro de erros

## Troubleshooting

### Erro: "API Key da OpenAI não configurada"
- Verifique se a API Key foi salva nas configurações
- Teste a conectividade na página de configurações

### Erro: "Execução do agente falhou"
- Verifique se a API Key é válida
- Confirme se tem créditos na conta OpenAI
- Verifique se o modelo GPT-4 está disponível

### Chat não responde
- Verifique o console do navegador para erros
- Confirme se a API route está funcionando
- Teste a conectividade com a OpenAI

## Próximas Features

1. **Base de Conhecimento Integrada**
   - Upload de documentos para treinar agentes
   - Busca semântica nos documentos
   - Respostas baseadas em conhecimento específico

2. **Personalização Avançada**
   - Editor de instruções personalizadas
   - Configuração de personalidade do agente
   - Templates customizáveis

3. **Analytics**
   - Métricas de uso do chat
   - Perguntas mais frequentes
   - Satisfação do usuário

4. **Integração com Outras Features**
   - Chat integrado com PDI
   - Assistente para vendas
   - Suporte ao mentor por voz
