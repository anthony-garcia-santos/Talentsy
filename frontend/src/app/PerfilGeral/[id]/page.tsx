// src/app/PerfilGeral/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { obterPerfilPorId, autenticacaoLogin } from '@/Services/Cliente/Cliente';
import Navbar from "@/components/navbar";
import Rodapé from "@/components/Rodapé";

interface Projeto {
  titulo: string;
  descricao: string;
}

interface Perfil {
  id: string;
  nome: string;
  email: string;
  foto?: string;
  sobre?: string;
  habilidades?: string;
  projetos_recentes?: string;
  cargo?: string;
}

export default function PerfilGeral() {
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const { id } = useParams();
  const idStr = Array.isArray(id) ? id[0] : id;
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const carregarPerfil = async () => {
    if (!idStr) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await obterPerfilPorId(idStr);
      console.log('Resposta completa:', response);
      
      const dados = response.data || response;
      
      if (!dados) {
        throw new Error('Dados do perfil não recebidos');
      }

      let projetosArray: Projeto[] = [];
      if (dados.projetos_recentes) {
        try {
          projetosArray = JSON.parse(dados.projetos_recentes);
          if (!Array.isArray(projetosArray)) {
            throw new Error('Formato inválido para projetos');
          }
        } catch (parseError) {
          console.error('Erro ao parsear projetos:', parseError);
          setError(
            parseError instanceof Error 
              ? parseError.message 
              : 'Formato de projetos inválido'
          );
        }
      }

      setPerfil({
        id: dados.id,
        nome: dados.nome,
        email: dados.email,
        foto: dados.foto || undefined,
        sobre: dados.sobre || '',
        habilidades: dados.habilidades || '',
        projetos_recentes: dados.projetos_recentes,
        cargo: dados.cargo || ''
      });
      
      setProjetos(projetosArray);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Erro ao carregar perfil'
      );
    } finally {
      setLoading(false);
    }
  };

  const obterUsuario = async () => {
    try {
      const usuario = await autenticacaoLogin();
      setUsuarioId(usuario.id.toString());
    } catch (error) {
      console.warn(
        "Usuário não autenticado:",
        error instanceof Error ? error.message : error
      );
    }
  };

  obterUsuario();
  carregarPerfil();
}, [idStr]);














  if (loading) {
    return (
      <main className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <div>Carregando perfil...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </main>
    );
  }

  if (!perfil) {
    return (
      <main className="min-h-screen bg-[#141414] text-white flex items-center justify-center">
        <div>Perfil não encontrado</div>
      </main>
    );
  }

  const habilidadesArray = perfil.habilidades
    ? perfil.habilidades.split(',').map(h => h.trim()).filter(Boolean)
    : [];

  const projetosExibicao = projetos.length > 0 ? projetos : [
    {
      titulo: "Desenvolvedor senior Talentsy",
      descricao: "Um aplicativo web que ajuda os usuários a se engajar no mercado profissional."
    },
    {
      titulo: "Desenvolvedor senior LoloPersonalizado",
      descricao: "Uma plataforma de comércio eletrônico com uma experiência de compra perfeita"
    },
  ];













  return (
    <main className="min-h-screen bg-[#141414] text-white">
      <Navbar
        usuarioId={usuarioId ?? null}
        perfilId={idStr ?? null}
      />

      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <img
              src={perfil.foto || "/file.jpg"}
              alt="Foto de perfil"
              className="w-30 h-30 rounded-full object-cover"
              width={120}
              height={120}
            />
            <div>
              <h1 className="text-2xl font-bold">{perfil.nome}</h1>
              <p className="text-gray-300">{perfil.cargo || "Cargo ou trabalho"}</p>
            </div>
          </div>




          {/* Sobre mim */}
          <div className="bg-[#222] p-4 rounded-[10px]">
            <h2 className="font-bold mb-2">Sobre mim</h2>
            <p>{perfil.sobre || "Adicione uma descrição sobre você"}</p>
          </div>





          {/* Habilidades */}
          <div className="bg-[#222] p-4 rounded-[10px]">
            <h2 className="font-bold mb-2">Habilidades</h2>
            {habilidadesArray.length > 0 ? (
              <ul className="list-disc ml-5">
                {habilidadesArray.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma habilidade cadastrada</p>
            )}
          </div>
        </div>




        {/* Projetos recentes - Lado direito */}
        <div className='bg-[#1A1A1A] p-4 rounded-2xl'>
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-xl font-bold">Projetos recentes</h2>

            {projetosExibicao.map((proj, index) => (
              <div key={index} className="bg-[#222] p-4 rounded-[10px] w-full">
                <h3 className="font-bold">{proj.titulo}</h3>
                <p className="text-gray-300">{proj.descricao}</p>
              </div>
            ))}

            <button className="mt-4 w-fit px-6 py-2 bg-gray-700 text-green-600 font-bold rounded-[10px] hover:bg-gray-300 cursor-pointer transition-colors">
              Entrar em contato
            </button>
          </div>
        </div>
      </div>

      <Rodapé />
    </main>
  );
}