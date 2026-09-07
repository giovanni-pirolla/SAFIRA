import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [perfilUsuario, setPerfilUsuario] = useState(null); // Novo estado para o perfil

    useEffect(() => {
        async function getSessionAndProfile() {
            setCarregando(true);
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);

            if (session) {
                // Se houver sessão, busca o perfil do usuário
                const { data: perfil, error } = await supabase
                    .from('usuario')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (error) {
                    console.error('Erro ao buscar perfil do usuário:', error.message);
                    setPerfilUsuario(null);
                } else {
                    setPerfilUsuario(perfil);
                }
            } else {
                setPerfilUsuario(null);
            }
            setCarregando(false);
        }

        getSessionAndProfile();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, novaSession) => {
            setSession(novaSession);
            // Quando a sessão muda, recarrega o perfil
            if (novaSession) {
                supabase
                    .from('usuario')
                    .select('*')
                    .eq('id', novaSession.user.id)
                    .single()
                    .then(({ data: perfil, error }) => {
                        if (error) console.error('Erro ao buscar perfil após mudança de sessão:', error.message);
                        setPerfilUsuario(perfil);
                    });
            } else {
                setPerfilUsuario(null);
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, carregando, perfilUsuario }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}