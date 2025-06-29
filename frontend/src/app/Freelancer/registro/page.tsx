'use client';

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar"; 
import NavbarInferior from "@/components/Rodapé"

export default function Home() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [ConfirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!nome || !email || !senha || !ConfirmarSenha) {
      alert("Preencha todos os campos.");
      setLoading(false);
      return;
    }

    if (senha !== ConfirmarSenha) {
      alert("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      alert("Cadastro simulado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#141414] text-white flex flex-col items-center">

      {}
      <Navbar />

      {}
      <div className="mt-20 mb-16 w-full px-4 flex flex-col md:flex-row justify-center items-center gap-1">

        {}
        <div className="
  flex flex-col justify-center items-center
  w-full
  sm:max-w-full md:max-w-[700px]

  h-auto md:min-h-[600px]

  bg-transparent sm:bg-transparent md:bg-[#1A1A1A]

  rounded-none sm:rounded-none md:rounded-2xl

  text-center px-2 sm:px-2 md:px-6 py-2 sm:py-2 md:py-6

  text-xl sm:text-xl md:text-5xl font-bold

  md:mt-[-120px] md:mr-20 md:ml-[-135px]
">
          Bem-vindo ao Talentsy
          <div className="text-sm sm:text-sm md:text-2xl mt-2 font-normal text-gray-300 max-w-full sm:max-w-full md:max-w-[500px]">
            Registre-se e mostre seu talento.
          </div>
        </div>


        {}
        <form onSubmit={handleSubmit} className="bg-[#222222] rounded-2xl p-6 w-full max-w-md flex flex-col gap-5">
          <div className="text-2xl font-bold text-center">Registro</div>

          <input
            type="text"
            placeholder="Nome"
            className="bg-white text-black p-3 rounded-3xl outline-none placeholder:font-bold"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="bg-white text-black p-3 rounded-3xl outline-none placeholder:font-bold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="bg-white text-black p-3 rounded-3xl outline-none placeholder:font-bold"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            className="bg-white text-black p-3 rounded-3xl outline-none placeholder:font-bold"
            value={ConfirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-700 p-3 rounded-3xl w-full text-center"
          >
            {loading ? "Criando conta..." : "Registrar-se"}
          </button>
        </form>
      </div>

      {}

      <NavbarInferior />

    </main>
  );
}
