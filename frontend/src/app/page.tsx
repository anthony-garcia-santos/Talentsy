'use client';

import Link from "next/link";
import Navbar from "@/components/navbar";
import { useState } from "react";
import Rodapé from "@/components/Rodapé"
export default function Home() {

    const [mostrarQuadrado, setMostrarQuadrado] = useState(false);

    return (
        <main className="min-h-screen bg-[#141414] text-white flex flex-col items-center">
            <Navbar />


            <div className="flex mt-16 bg-black p-2 text-center">
                <div className="w-[1350px] h-auto text-[150px] font-bold">
                    Talentsy
                </div>
            </div>


            {}
            <div className="flex justify-center items-center mt-[20px]">
                <button
                    onClick={() => setMostrarQuadrado(!mostrarQuadrado)}
                    className="bg-[#9B59B6] max-w-[188px] max-h-[69px] px-6 py-2 rounded-md text-white text-[20px] mb-6"
                >
                    {mostrarQuadrado ? "" : ""} Crie sua conta
                </button>

                <Rodapé />


                {mostrarQuadrado && (
                    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex flex-col gap-12 items-center justify-center w-2x5 h-64 bg-[#222222] rounded-lg text-black shadow-lg p-4">

                            <div className="mb-4 text-center text-2xl text-white font-semibold">Seja bem vindo como gostaria de se registrar?</div>
                            <div className="flex flex-row gap-5 ">

                                <div className="transition-transform duration-500 hover:scale-110">
                                    <Link href="/Empresa/registro">

                                        <span className="transition-colors duration-500 hover:text-blue-400 bg-zinc-900 rounded-2xl p-3 cursor-pointer text-gray-500 text-[18px] font-bold ">
                                            Empresa
                                        </span>

                                    </Link>
                                </div>

                                <div className="transition-transform duration-500 hover:scale-110">
                                    <Link href="/Cliente/registro">

                                        <span className="transition-colors duration-500 hover:text-blue-400 bg-zinc-900 rounded-2xl p-3 cursor-pointer text-green-600 text-[18px] font-bold ">
                                            Cliente
                                        </span>

                                    </Link>
                                </div>
                                <div className="transition-transform duration-500 hover:scale-110">
                                    <Link href="/Freelancer/registro">

                                        <span className="transition-colors duration-500 hover:text-blue-400 bg-zinc-900 rounded-2xl p-3 cursor-pointer text-white text-[18px] font-bold ">
                                            Freelancer
                                        </span>

                                    </Link>
                                </div>
                            </div>

                            <div className="transition-transform duration-500 hover:scale-110">
                                <button
                                    className="w-24 h-10 transition-colors duration-500 hover:text-blue-400  bg-indigo-600 text-white rounded "
                                    onClick={() => setMostrarQuadrado(false)}
                                >
                                    Voltar
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </div>

        </main >
    );
}
