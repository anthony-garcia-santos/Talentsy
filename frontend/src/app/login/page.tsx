
'use client';

import { useState, type FormEvent } from "react";
import { useRouter } from 'next/navigation';
import Navbar from "@/components/navbar";
import Rodape from "@/components/Rodape"; // Certifique-se que o nome do arquivo não tem acento!
import { login } from "@/Services/Cliente/Login";
import Link from "next/link";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validação simples
        if (!email.trim() || !senha.trim()) {
            setError("Preencha todos os campos.");
            setLoading(false);
            return;
        }

        try {
            const response = await login({ email, senha });

            console.log("Login bem-sucedido:", response);
            alert("Login realizado com sucesso!");
            router.push('/');
        } catch (err) {
            console.error("Erro ao fazer login:", err);
            setError("Email ou senha incorretos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#141414] text-white flex flex-col items-center">
            <Navbar />

            <div className="mt-20 mb-16 w-full px-4 flex flex-col md:flex-row justify-center items-center gap-4">
                {/* Texto de boas-vindas */}
                <div className="
                    flex flex-col justify-center items-center
                    w-full md:max-w-[700px]
                    h-auto md:min-h-[600px]
                    bg-transparent md:bg-[#1A1A1A]
                    md:rounded-2xl
                    text-center px-2 md:px-6 py-2 md:py-6
                    text-xl md:text-5xl font-bold
                ">
                    Bem-vindo ao Talentsy
                    <p className="text-sm md:text-lg mt-2 font-normal text-gray-300 max-w-full md:max-w-[500px]">
                        Registre-se e mostre seu talento.
                    </p>
                </div>

                {/* Formulário de login */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-[#222222] rounded-2xl p-6 w-full max-w-md flex flex-col gap-5"
                    noValidate
                >
                    <h2 className="text-2xl font-bold text-center">Login</h2>

                    <input
                        type="email"
                        placeholder="Email"
                        className="bg-white text-black p-3 rounded-3xl outline-none placeholder:font-bold"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        className="bg-white text-black p-3 rounded-3xl outline-none placeholder:font-bold"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-indigo-700 p-3 rounded-3xl w-full font-bold transition-opacity ${
                            loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
                        }`}
                    >
                        {loading ? "Entrando..." : "Logar-se"}
                    </button>

                    <p className="text-center text-sm text-gray-400 mt-2">
                        Ainda não tem conta?{" "}
                        <Link href="/register" className="text-indigo-500 hover:underline">
                            Registre-se
                        </Link>
                    </p>
                </form>
            </div>

            <Rodape />
        </main>
    );
}

