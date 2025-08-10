import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Empresa, Usuario } from './supabase'

interface AppState {
  // Estado da empresa selecionada
  empresaSelecionada: Empresa | null
  usuarioLogado: Usuario | null
  isAuthenticated: boolean
  
  // Actions
  setEmpresaSelecionada: (empresa: Empresa | null) => void
  setUsuarioLogado: (usuario: Usuario | null) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      empresaSelecionada: null,
      usuarioLogado: null,
      isAuthenticated: false,
      
      setEmpresaSelecionada: (empresa) => 
        set({ empresaSelecionada: empresa }),
      
      setUsuarioLogado: (usuario) => 
        set({ 
          usuarioLogado: usuario, 
          isAuthenticated: !!usuario 
        }),
      
      logout: () => 
        set({ 
          empresaSelecionada: null, 
          usuarioLogado: null, 
          isAuthenticated: false 
        }),
    }),
    {
      name: 'ramppy-storage',
      partialize: (state) => ({
        empresaSelecionada: state.empresaSelecionada,
        usuarioLogado: state.usuarioLogado,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
