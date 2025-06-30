'use client';

import Link from "next/link";
import Navbar from "@/components/navbar";
import Rodapé from "@/components/Rodapé";
import { useState } from "react";

export default function Home() {
  const [mostrarQuadrado, setMostrarQuadrado] = useState(false);

  return (
    <main className="min-h-screen bg-[#141414] text-white flex flex-col items-center">
      <Navbar />

      {}
      <div className="w-full text-center bg-black p-16 mt-10">
        <h1 className="text-4xl md:text-[100px] font-bold">Talentsy</h1>
      </div>

      {}
      <div className="flex justify-center items-center mt-8 w-full px-4">
        <button
          onClick={() => setMostrarQuadrado(true)}
          className="bg-[#9B59B6] w-full max-w-[200px] px-6 py-3 rounded-md text-white text-lg sm:text-xl font-semibold"
        >
          Crie sua conta
        </button>
      </div>

      {}
      {mostrarQuadrado && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="flex flex-col items-center gap-6 bg-[#222222] rounded-lg p-6 w-full max-w-md text-center shadow-lg">
            <h2 className="text-xl font-semibold text-white">Como deseja se registrar?</h2>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/Empresa/registro">
                <span className="bg-zinc-900 text-gray-300 hover:text-blue-400 font-bold px-4 py-2 rounded-xl transition-all">
                  Empresa
                </span>
              </Link>

              <Link href="/Cliente/registro">
                <span className="bg-zinc-900 text-green-500 hover:text-blue-400 font-bold px-4 py-2 rounded-xl transition-all">
                  Cliente
                </span>
              </Link>

              <Link href="/Freelancer/registro">
                <span className="bg-zinc-900 text-white hover:text-blue-400 font-bold px-4 py-2 rounded-xl transition-all">
                  Freelancer
                </span>
              </Link>
            </div>

            <button
              onClick={() => setMostrarQuadrado(false)}
              className="bg-indigo-600 text-white px-5 py-2 rounded transition hover:bg-indigo-700"
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 w-full">
        <Rodapé />
      </div>
    </main>
  );
}
