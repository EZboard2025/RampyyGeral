'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Mic, 
  BookOpen, 
  Target, 
  Settings, 
  LogOut,
  Building2,
  User,
  TrendingUp,
  Calendar
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { ConfiguracaoEmpresa } from '@/lib/supabase'

export default function DashboardPage() {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoEmpresa | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { empresaSelecionada, usuarioLogado, logout } = useAppStore()

  useEffect(() => {
    // Verificar se usuário está logado
    if (!empresaSelecionada || !usuarioLogado) {
      router.push('/')
      return
    }

    carregarConfiguracao()
  }, [empresaSelecionada, usuarioLogado, router])

  const carregarConfiguracao = async () => {
    try {
      // Aqui você carregaria a configuração da empresa
      // Por enquanto, vamos usar uma configuração padrão
      setConfiguracao({
        id: '1',
        empresa_id: empresaSelecionada!.id,
        feature_chat_ia: true,
        feature_roleplay: true,
        feature_pdi: true,
        feature_dashboard: true,
        feature_base_conhecimento: true,
        feature_mentor_voz: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Erro ao carregar configuração:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const features = [
    {
      id: 'dashboard',
      nome: 'Dashboard',
      descricao: 'Métricas e análises de vendas',
      icone: BarChart3,
      ativo: configuracao?.feature_dashboard ?? true,
      href: '/dashboard/metricas'
    },
    {
      id: 'chat-ia',
      nome: 'Chat IA',
      descricao: 'Assistente inteligente treinado',
      icone: MessageSquare,
      ativo: configuracao?.feature_chat_ia ?? true,
      href: '/dashboard/chat'
    },
    {
      id: 'roleplay',
      nome: 'Roleplay',
      descricao: 'Simulações de vendas com IA',
      icone: Mic,
      ativo: configuracao?.feature_roleplay ?? true,
      href: '/dashboard/roleplay'
    },
    {
      id: 'pdi',
      nome: 'PDI',
      descricao: 'Plano de Desenvolvimento Individual',
      icone: Target,
      ativo: configuracao?.feature_pdi ?? true,
      href: '/dashboard/pdi'
    },
    {
      id: 'base-conhecimento',
      nome: 'Base de Conhecimento',
      descricao: 'Documentos e treinamentos',
      icone: BookOpen,
      ativo: configuracao?.feature_base_conhecimento ?? true,
      href: '/dashboard/conhecimento'
    },
    {
      id: 'mentor-voz',
      nome: 'Mentor por Voz',
      descricao: 'Treinamento com ElevenLabs',
      icone: Mic,
      ativo: configuracao?.feature_mentor_voz ?? true,
      href: '/dashboard/mentor'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
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
                  {empresaSelecionada?.nome}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-700">
                <User className="h-4 w-4 mr-2" />
                {usuarioLogado?.nome}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bem-vindo, {usuarioLogado?.nome}!
            </h2>
            <p className="text-gray-600">
              Acesse as funcionalidades disponíveis para sua empresa abaixo.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icone
              return (
                <div
                  key={feature.id}
                  className={`card transition-all duration-200 ${
                    feature.ativo 
                      ? 'hover:shadow-lg cursor-pointer border-l-4' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{
                    borderLeftColor: feature.ativo ? empresaSelecionada?.cor_primaria : undefined
                  }}
                  onClick={() => {
                    if (feature.ativo) {
                      router.push(feature.href)
                    }
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div 
                      className="p-2 rounded-lg mr-3"
                      style={{ 
                        backgroundColor: feature.ativo 
                          ? `${empresaSelecionada?.cor_primaria}20` 
                          : '#f3f4f6'
                      }}
                    >
                      <IconComponent 
                        className="h-6 w-6" 
                        style={{ 
                          color: feature.ativo 
                            ? empresaSelecionada?.cor_primaria 
                            : '#9ca3af'
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feature.nome}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {feature.descricao}
                      </p>
                    </div>
                  </div>
                  
                  {!feature.ativo && (
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Em breve
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="px-4 py-6 sm:px-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumo Rápido
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-100 mr-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vendas do Mês</p>
                  <p className="text-2xl font-bold text-gray-900">R$ 45.230</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-100 mr-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Funcionários</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-100 mr-3">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Treinamentos</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
