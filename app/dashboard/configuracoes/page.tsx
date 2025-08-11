'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Settings, 
  Key, 
  Bot, 
  Save, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import { isGestor } from '@/lib/auth'

interface ConfiguracaoEmpresa {
  id: string
  empresa_id: string
  feature_chat_ia: boolean
  feature_roleplay: boolean
  feature_pdi: boolean
  feature_dashboard: boolean
  feature_base_conhecimento: boolean
  feature_mentor_voz: boolean
  openai_api_key?: string
  openai_agent_id?: string
  openai_agent_instructions?: string
  openai_model?: string
  elevenlabs_api_key?: string
  created_at: string
  updated_at: string
}

export default function ConfiguracoesPage() {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoEmpresa | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showOpenAIKey, setShowOpenAIKey] = useState(false)
  const [showElevenLabsKey, setShowElevenLabsKey] = useState(false)
  const [openaiApiKey, setOpenaiApiKey] = useState('')
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState('')
  const [openaiAgentId, setOpenaiAgentId] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const router = useRouter()
  const { empresaSelecionada, usuarioLogado } = useAppStore()

  useEffect(() => {
    if (!isGestor(usuarioLogado)) {
      router.push('/dashboard')
      return
    }
    
    if (empresaSelecionada?.id) {
      carregarConfiguracao()
    }
  }, [usuarioLogado, empresaSelecionada])

  const carregarConfiguracao = async () => {
    try {
      if (!empresaSelecionada?.id) {
        console.error('Empresa não selecionada')
        setMessage({ type: 'error', text: 'Empresa não selecionada' })
        return
      }

      console.log('Carregando configuração para empresa:', empresaSelecionada.id)

      // Primeiro, vamos verificar se existe uma configuração para esta empresa
      const { data: existingConfig, error: checkError } = await supabase
        .from('configuracoes_empresa')
        .select('id')
        .eq('empresa_id', empresaSelecionada.id)
        .single()

      if (checkError && checkError.code === 'PGRST116') {
        // Configuração não existe, vamos criar uma
        console.log('Criando nova configuração para empresa')
        const { data: newConfig, error: createError } = await supabase
          .from('configuracoes_empresa')
          .insert({
            empresa_id: empresaSelecionada.id,
            feature_chat_ia: true,
            feature_roleplay: true,
            feature_pdi: true,
            feature_dashboard: true,
            feature_base_conhecimento: true,
            feature_mentor_voz: true
          })
          .select()
          .single()

        if (createError) throw createError
        setConfiguracao(newConfig)
        setOpenaiApiKey('')
        setElevenlabsApiKey('')
        setOpenaiAgentId('')
      } else if (checkError) {
        throw checkError
      } else {
        // Configuração existe, vamos carregar
        const { data, error } = await supabase
          .from('configuracoes_empresa')
          .select('*')
          .eq('empresa_id', empresaSelecionada.id)
          .single()

        if (error) throw error

        setConfiguracao(data)
        setOpenaiApiKey(data.openai_api_key || '')
        setElevenlabsApiKey(data.elevenlabs_api_key || '')
        setOpenaiAgentId(data.openai_agent_id || '')
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error)
      setMessage({ type: 'error', text: 'Erro ao carregar configurações: ' + (error instanceof Error ? error.message : 'Erro desconhecido') })
    } finally {
      setLoading(false)
    }
  }

  const handleSalvar = async () => {
    if (!configuracao) return

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('configuracoes_empresa')
                 .update({
           openai_api_key: openaiApiKey || null,
           elevenlabs_api_key: elevenlabsApiKey || null,
           openai_agent_id: openaiAgentId || null,
           updated_at: new Date().toISOString()
         })
        .eq('id', configuracao.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' })
      
      // Recarregar configuração
      await carregarConfiguracao()
    } catch (error) {
      console.error('Erro ao salvar configuração:', error)
      setMessage({ type: 'error', text: 'Erro ao salvar configurações' })
    } finally {
      setSaving(false)
    }
  }

  const handleVoltar = () => {
    router.push('/dashboard')
  }

  const testarOpenAI = async () => {
    if (!openaiApiKey) {
      setMessage({ type: 'error', text: 'Digite uma API Key da OpenAI primeiro' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/chat?empresaId=${empresaSelecionada?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'API Key da OpenAI válida!' })
      } else {
        const errorData = await response.json()
        setMessage({ type: 'error', text: 'API Key da OpenAI inválida: ' + (errorData.error || 'Erro desconhecido') })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao testar API Key' })
    } finally {
      setSaving(false)
    }
  }

  const testarAgente = async () => {
    if (!openaiApiKey) {
      setMessage({ type: 'error', text: 'Digite uma API Key da OpenAI primeiro' })
      return
    }

    if (!openaiAgentId) {
      setMessage({ type: 'error', text: 'Digite o ID do agente primeiro' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Olá! Este é um teste do agente.',
          empresaId: empresaSelecionada?.id
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessage({ type: 'success', text: 'Agente testado com sucesso! Resposta: ' + data.content.substring(0, 100) + '...' })
      } else {
        const errorData = await response.json()
        setMessage({ type: 'error', text: 'Erro ao testar agente: ' + (errorData.error || 'Erro desconhecido') })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao testar agente' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-4 text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={handleVoltar}
                  className="flex items-center text-gray-500 hover:text-gray-700 mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </button>
                
                <div className="flex items-center">
                  {empresaSelecionada?.logo_url ? (
                    <img
                      src={empresaSelecionada.logo_url}
                      alt={empresaSelecionada.nome}
                      className="h-8 w-8 rounded-lg object-cover mr-3"
                    />
                  ) : (
                    <div 
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold mr-3"
                      style={{ backgroundColor: empresaSelecionada?.cor_primaria }}
                    >
                      {empresaSelecionada?.nome.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h1 className="text-xl font-semibold text-gray-900">
                    Configurações - {empresaSelecionada?.nome}
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-700">
                  <Settings className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Configurações</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
                         {/* OpenAI Configuration */}
             <div className="card mb-6">
               <div className="flex items-center mb-4">
                 <Bot className="h-6 w-6 mr-3 text-purple-500" />
                 <h2 className="text-xl font-semibold text-gray-900">
                   Configuração do Assistente de IA
                 </h2>
               </div>
               
               <div className="space-y-6">
                 {/* API Key */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     API Key da OpenAI
                   </label>
                   <div className="relative">
                     <input
                       type={showOpenAIKey ? 'text' : 'password'}
                       value={openaiApiKey}
                       onChange={(e) => setOpenaiApiKey(e.target.value)}
                       placeholder="sk-..."
                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                     />
                     <button
                       type="button"
                       onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                       className="absolute inset-y-0 right-0 pr-3 flex items-center"
                     >
                       {showOpenAIKey ? (
                         <EyeOff className="h-5 w-5 text-gray-400" />
                       ) : (
                         <Eye className="h-5 w-5 text-gray-400" />
                       )}
                     </button>
                   </div>
                   <p className="text-sm text-gray-500 mt-1">
                     Chave necessária para o funcionamento do Chat IA
                   </p>
                 </div>

                                   {/* Agent ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID do Agente
                    </label>
                    <input
                      type="text"
                      value={openaiAgentId}
                      onChange={(e) => setOpenaiAgentId(e.target.value)}
                      placeholder="asst_..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      ID do agente criado no playground da OpenAI
                    </p>
                  </div>

                 <div className="flex space-x-3">
                   <button
                     onClick={testarOpenAI}
                     disabled={saving || !openaiApiKey}
                     className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                   >
                     <CheckCircle className="h-4 w-4 mr-2" />
                     Testar API Key
                   </button>
                   <button
                     onClick={testarAgente}
                     disabled={saving || !openaiApiKey}
                     className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                   >
                     <Bot className="h-4 w-4 mr-2" />
                     Testar Agente
                   </button>
                 </div>
               </div>
             </div>

            {/* ElevenLabs Configuration */}
            <div className="card mb-6">
              <div className="flex items-center mb-4">
                <Key className="h-6 w-6 mr-3 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Configuração ElevenLabs
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key da ElevenLabs
                  </label>
                  <div className="relative">
                    <input
                      type={showElevenLabsKey ? 'text' : 'password'}
                      value={elevenlabsApiKey}
                      onChange={(e) => setElevenlabsApiKey(e.target.value)}
                      placeholder="..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowElevenLabsKey(!showElevenLabsKey)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showElevenLabsKey ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Chave necessária para o funcionamento do Mentor por Voz
                  </p>
                </div>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg flex items-center ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                {message.text}
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSalvar}
                disabled={saving}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                style={{
                  backgroundColor: empresaSelecionada?.cor_primaria
                }}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Configurações
              </button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
