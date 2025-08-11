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
    console.log('Buscando configuração para empresa:', empresaId)
    
    // Tentar carregar configuração existente
    const { data, error } = await supabase
      .from('configuracoes_empresa')
      .select('*')
      .eq('empresa_id', empresaId)
      .single()

    if (error && error.code === 'PGRST116') {
      // Configuração não existe, vamos criar uma
      console.log('Criando nova configuração para empresa')
      const { data: newConfig, error: createError } = await supabase
        .from('configuracoes_empresa')
        .insert({
          empresa_id: empresaId,
          feature_chat_ia: true,
          feature_roleplay: true,
          feature_pdi: true,
          feature_dashboard: true,
          feature_base_conhecimento: true,
          feature_mentor_voz: true
        })
        .select()
        .single()

      if (createError) {
        console.error('Erro ao criar configuração:', createError)
        throw createError
      }
      
      console.log('Nova configuração criada:', newConfig)
      return newConfig
    } else if (error) {
      console.error('Erro na consulta Supabase:', error)
      throw error
    } else {
      console.log('Configuração encontrada:', data)
      return data
    }
  } catch (error) {
    console.error('Erro ao buscar configuração da empresa:', error)
    return null
  }
}

// Função para criar instância do serviço OpenAI
export function createOpenAIService(apiKey: string): OpenAIService {
  return new OpenAIService(apiKey)
}


