import { supabase } from './supabase'

// Interface para configuração do agente
export interface AgentConfig {
  id: string
  name: string
  instructions: string
  model: string
  tools?: string[]
}

// Interface para mensagem do chat
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// Interface para resposta da API
export interface ChatResponse {
  content: string
  threadId?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Classe para gerenciar a integração com OpenAI
export class OpenAIService {
  private apiKey: string
  private baseUrl: string = 'https://api.openai.com/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // Método para criar um agente no playground da OpenAI
  async createAgent(config: AgentConfig): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/assistants`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
          name: config.name,
          instructions: config.instructions,
          model: config.model,
          tools: config.tools || []
        })
      })

      if (!response.ok) {
        throw new Error(`Erro ao criar agente: ${response.statusText}`)
      }

      const data = await response.json()
      return data.id
    } catch (error) {
      console.error('Erro ao criar agente:', error)
      throw error
    }
  }

  // Método para enviar mensagem para o agente
  async sendMessage(agentId: string, message: string, threadId?: string): Promise<ChatResponse> {
    try {
      let currentThreadId = threadId

      // Se não há thread, criar um novo
      if (!currentThreadId) {
        const threadResponse = await fetch(`${this.baseUrl}/threads`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v1'
          }
        })

        if (!threadResponse.ok) {
          throw new Error(`Erro ao criar thread: ${threadResponse.statusText}`)
        }

        const threadData = await threadResponse.json()
        currentThreadId = threadData.id
      }

      // Adicionar mensagem ao thread
      const messageResponse = await fetch(`${this.baseUrl}/threads/${currentThreadId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
          role: 'user',
          content: message
        })
      })

      if (!messageResponse.ok) {
        throw new Error(`Erro ao enviar mensagem: ${messageResponse.statusText}`)
      }

      // Executar o agente
      const runResponse = await fetch(`${this.baseUrl}/threads/${currentThreadId}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v1'
        },
        body: JSON.stringify({
          assistant_id: agentId
        })
      })

      if (!runResponse.ok) {
        throw new Error(`Erro ao executar agente: ${runResponse.statusText}`)
      }

      const runData = await runResponse.json()
      const runId = runData.id

      // Aguardar a conclusão da execução
      let runStatus = 'queued'
      while (runStatus === 'queued' || runStatus === 'in_progress') {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const statusResponse = await fetch(`${this.baseUrl}/threads/${currentThreadId}/runs/${runId}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'OpenAI-Beta': 'assistants=v1'
          }
        })

        if (!statusResponse.ok) {
          throw new Error(`Erro ao verificar status: ${statusResponse.statusText}`)
        }

        const statusData = await statusResponse.json()
        runStatus = statusData.status

        if (runStatus === 'failed') {
          throw new Error('Execução do agente falhou')
        }
      }

      // Buscar a resposta
      const messagesResponse = await fetch(`${this.baseUrl}/threads/${currentThreadId}/messages`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v1'
        }
      })

      if (!messagesResponse.ok) {
        throw new Error(`Erro ao buscar mensagens: ${messagesResponse.statusText}`)
      }

      const messagesData = await messagesResponse.json()
      const lastMessage = messagesData.data[0] // A primeira mensagem é a mais recente

      return {
        content: lastMessage.content[0].text.value,
        threadId: currentThreadId,
        usage: runData.usage
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      throw error
    }
  }

  // Método para listar agentes existentes
  async listAgents(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/assistants`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v1'
        }
      })

      if (!response.ok) {
        throw new Error(`Erro ao listar agentes: ${response.statusText}`)
      }

      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Erro ao listar agentes:', error)
      throw error
    }
  }

  // Método para deletar um agente
  async deleteAgent(agentId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/assistants/${agentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'OpenAI-Beta': 'assistants=v1'
        }
      })

      if (!response.ok) {
        throw new Error(`Erro ao deletar agente: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Erro ao deletar agente:', error)
      throw error
    }
  }
}

// Função para obter configuração da empresa
export async function getEmpresaConfig(empresaId: string) {
  try {
    const { data, error } = await supabase
      .from('configuracoes_empresa')
      .select('*')
      .eq('empresa_id', empresaId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar configuração da empresa:', error)
    return null
  }
}

// Função para criar instância do serviço OpenAI
export function createOpenAIService(apiKey: string): OpenAIService {
  return new OpenAIService(apiKey)
}

// Templates de instruções para diferentes tipos de empresa
export const AGENT_TEMPLATES = {
  template: {
    name: 'Assistente Template',
    instructions: `Você é um assistente IA especializado em ajudar funcionários da empresa Template.
    
    Suas responsabilidades incluem:
    - Responder dúvidas sobre processos da empresa
    - Ajudar com treinamentos e desenvolvimento
    - Fornecer informações sobre produtos e serviços
    - Auxiliar em questões de vendas e atendimento
    
    Sempre seja cordial, profissional e útil. Se não souber algo, seja honesto sobre isso.`,
    model: 'gpt-4-turbo-preview'
  },
  
  techcorp: {
    name: 'Assistente TechCorp',
    instructions: `Você é um assistente IA especializado em tecnologia e software da empresa TechCorp.
    
    Suas responsabilidades incluem:
    - Ajudar com vendas de software empresarial
    - Explicar funcionalidades técnicas dos produtos
    - Auxiliar em demonstrações e apresentações
    - Responder dúvidas sobre implementação e suporte
    
    Use linguagem técnica quando apropriado, mas sempre de forma clara e acessível.`,
    model: 'gpt-4-turbo-preview'
  },
  
  salespro: {
    name: 'Assistente SalesPro',
    instructions: `Você é um assistente IA especializado em vendas e consultoria da empresa SalesPro.
    
    Suas responsabilidades incluem:
    - Ajudar com técnicas de vendas e prospecção
    - Auxiliar em propostas comerciais
    - Fornecer insights sobre mercado e concorrência
    - Apoiar em treinamentos de vendas
    
    Foque em resultados e ROI para o cliente. Seja persuasivo mas ético.`,
    model: 'gpt-4-turbo-preview'
  },
  
  innovatelab: {
    name: 'Assistente InnovateLab',
    instructions: `Você é um assistente IA especializado em inovação e pesquisa da empresa InnovateLab.
    
    Suas responsabilidades incluem:
    - Ajudar com projetos de inovação
    - Auxiliar em pesquisas e desenvolvimento
    - Fornecer insights sobre tendências tecnológicas
    - Apoiar em apresentações de projetos inovadores
    
    Seja criativo e visionário, mas sempre baseado em dados e fatos.`,
    model: 'gpt-4-turbo-preview'
  }
}
