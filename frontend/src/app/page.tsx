'use client';

import Link from "next/link";
import Navbar from "@/components/navbar";
import Rodapé from "@/components/Rodapé";
import { useState } from "react";
import ClienteVitrine from "@/components/ClientesVitrine"

export default function Home() {
    const [mostrarQuadrado, setMostrarQuadrado] = useState(false);

    return (
        <main className="min-h-screen bg-[#141414] text-white flex flex-col items-center">
            <Navbar />

            <div className="relative w-full text-center bg-black/70 backdrop-blur-2xl text-white p-8 sm:p-16 mt-15 h-32 sm:h-44">
                <h1 className="text-5xl sm:text-6xl md:text-[100px] bottom-4 font-bold z-10 relative md:top-[-30px] sm:top-4">Talentsy</h1>
            </div>

            <div className="flex justify-center items-center mt-10 mb-[-10px] w-full px-4">
                <button
                    onClick={() => setMostrarQuadrado(true)}
                    className="bg-[#9B59B6] w-full max-w-[188px] px-4 sm:px-6 py-2 sm:py-3 rounded-md text-white text-base sm:text-lg md:text-xl font-semibold cursor-pointer"
                >
                    Crie sua conta
                </button>
            </div>

            {mostrarQuadrado && (
                <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
                    <div className="flex flex-col items-center gap-4 sm:gap-6 bg-[#222222] rounded-lg p-4 sm:p-6 w-full max-w-md text-center shadow-lg">
                        <h2 className="text-lg sm:text-xl font-semibold text-white">Como deseja se registrar?</h2>

                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                            <Link href="/Cliente">
                                <span className="bg-zinc-900 text-green-500 hover:text-blue-400 font-bold px-3 sm:px-4 py-1 sm:py-2 rounded-xl transition-all cursor-pointer text-sm sm:text-base">
                                    Cliente
                                </span>
                            </Link>

                            <Link href="/Freelancer">
                                <span className="bg-zinc-900 text-white hover:text-blue-400 font-bold px-3 sm:px-4 py-1 sm:py-2 rounded-xl transition-all cursor-pointer text-sm sm:text-base">
                                    Freelancer
                                </span>
                            </Link>
                        </div>

                        <button
                            onClick={() => setMostrarQuadrado(false)}
                            className="bg-indigo-600 text-white px-4 sm:px-5 py-1 sm:py-2 rounded transition hover:bg-indigo-700 cursor-pointer text-sm sm:text-base"
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            )}

            <div className="flex justify-center w-full px-4">
                <ClienteVitrine />
            </div>

            <div className="mt-8 sm:mt-12 w-full">
                <Rodapé />
            </div>
        </main>
    );
} 