import { NextRequest, NextResponse } from 'next/server'
import { OpenAIService, getEmpresaConfig } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

// POST - Enviar mensagem para o agente
export async function POST(request: NextRequest) {
  try {
    const { message, empresaId, threadId, apiKey, agentId } = await request.json()

    if (!message || !empresaId) {
      return NextResponse.json(
        { error: 'Mensagem e empresaId são obrigatórios' },
        { status: 400 }
      )
    }

    // Se a API key foi enviada no request, usar ela
    let openaiApiKey = apiKey
    let openaiAgentId = agentId

    // Se não foi enviada, tentar buscar do banco
    if (!openaiApiKey || !openaiAgentId) {
      const config = await getEmpresaConfig(empresaId)
      if (!config || !config.openai_api_key) {
        return NextResponse.json(
          { error: 'API Key da OpenAI não configurada para esta empresa' },
          { status: 400 }
        )
      }
      openaiApiKey = config.openai_api_key
      openaiAgentId = config.openai_agent_id
    }

    if (!openaiAgentId) {
      return NextResponse.json(
        { error: 'ID do agente não configurado para esta empresa' },
        { status: 400 }
      )
    }

    // Criar instância do serviço OpenAI
    const openaiService = new OpenAIService(openaiApiKey)

    // Enviar mensagem para o agente
    const response = await openaiService.sendMessage(openaiAgentId, message, threadId)

    return NextResponse.json({
      content: response.content,
      threadId: response.threadId || threadId, // Retornar o threadId para continuar a conversa
      usage: response.usage
    })

  } catch (error) {
    console.error('Erro no chat:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor: ' + (error instanceof Error ? error.message : 'Erro desconhecido') },
      { status: 500 }
    )
  }
}

// GET - Listar agentes da empresa
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const empresaId = searchParams.get('empresaId')
    const apiKey = searchParams.get('apiKey')

    if (!empresaId) {
      return NextResponse.json(
        { error: 'empresaId é obrigatório' },
        { status: 400 }
      )
    }

    // Se a API key foi enviada no request, usar ela
    let openaiApiKey = apiKey

    // Se não foi enviada, tentar buscar do banco
    if (!openaiApiKey) {
      const config = await getEmpresaConfig(empresaId)
      if (!config || !config.openai_api_key) {
        return NextResponse.json(
          { error: 'API Key da OpenAI não configurada' },
          { status: 400 }
        )
      }
      openaiApiKey = config.openai_api_key
    }

    // Criar instância do serviço OpenAI
    const openaiService = new OpenAIService(openaiApiKey)

    // Listar agentes
    const agents = await openaiService.listAgents()

    return NextResponse.json({ agents })

  } catch (error) {
    console.error('Erro ao listar agentes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
