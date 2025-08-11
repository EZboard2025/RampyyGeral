import { NextRequest, NextResponse } from 'next/server'
import { OpenAIService, AGENT_TEMPLATES, getEmpresaConfig } from '@/lib/openai'
import { supabase } from '@/lib/supabase'

// POST - Enviar mensagem para o agente
export async function POST(request: NextRequest) {
  try {
    const { message, empresaId, threadId } = await request.json()

    if (!message || !empresaId) {
      return NextResponse.json(
        { error: 'Mensagem e empresaId são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar configuração da empresa
    const config = await getEmpresaConfig(empresaId)
    if (!config || !config.openai_api_key) {
      return NextResponse.json(
        { error: 'API Key da OpenAI não configurada para esta empresa' },
        { status: 400 }
      )
    }

    if (!config.openai_agent_id) {
      return NextResponse.json(
        { error: 'ID do agente não configurado para esta empresa' },
        { status: 400 }
      )
    }

    // Criar instância do serviço OpenAI
    const openaiService = new OpenAIService(config.openai_api_key)

    // Enviar mensagem para o agente
    const response = await openaiService.sendMessage(config.openai_agent_id, message, threadId)

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

    if (!empresaId) {
      return NextResponse.json(
        { error: 'empresaId é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar configuração da empresa
    const config = await getEmpresaConfig(empresaId)
    if (!config || !config.openai_api_key) {
      return NextResponse.json(
        { error: 'API Key da OpenAI não configurada' },
        { status: 400 }
      )
    }

    // Criar instância do serviço OpenAI
    const openaiService = new OpenAIService(config.openai_api_key)

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
