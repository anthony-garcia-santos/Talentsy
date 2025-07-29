'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';

interface NavbarProps {
    usuarioId?: string | null;
    perfilId?: string | null;
}

export default function Navbar({ usuarioId, perfilId }: NavbarProps) {
    const pathname = usePathname();

    const isLoginPage = pathname === "/login";
    const isHomepage = pathname === "/";
    const isPerfilpage = pathname.startsWith("/PerfilGeral/");

    const isRegisterPage =
        pathname.toLowerCase().startsWith("/empresa/registro") ||
        pathname.toLowerCase().startsWith("/freelancer/registro") ||
        pathname.toLowerCase().startsWith("/cliente/registro");

    return (
        <nav className="bg-[#1A1A1A] w-full h-16 flex items-center justify-between px-4 sm:px-8 fixed top-0 left-0 z-50 shadow-md border-b border-zinc-800">
            <div className="flex items-center gap-2 text-lg sm:text-xl font-bold">
                <img src="/icon.logo.png" alt="logo" className="h-6 sm:h-8 w-auto" />
                <div>talentsy</div>
            </div>

            <div className="flex gap-1 sm:gap-2 text-xs sm:text-sm">
                {isHomepage && (
                    <Link href="/login">
                        <span className="transition-colors duration-500 hover:text-indigo-400 cursor-pointer text-base sm:text-[20px] font-bold">
                            Logar-se
                        </span>
                    </Link>
                )}

                {isRegisterPage && (
                    <>
                        <Link href="/">
                            <span className="transition-colors duration-500 hover:text-indigo-400 cursor-pointer text-base sm:text-[20px] font-bold px-2 sm:px-11">
                                Inicio
                            </span>
                        </Link>

                        <Link href="/login">
                            <span className="transition-colors duration-500 hover:text-indigo-400 cursor-pointer text-base sm:text-[20px] font-bold">
                                Já tem conta?
                            </span>
                        </Link>
                    </>
                )}

                {isLoginPage && (
                    <Link href="/">
                        <span className="transition-colors duration-500 hover:text-indigo-400 cursor-pointer text-base sm:text-[20px] font-bold">
                            inicio
                        </span>
                    </Link>
                )}

                {isPerfilpage && (
                    <>
                        {usuarioId && perfilId && usuarioId === perfilId && (
                            <Link href={`/PerfilGeral/editarPerfil/${perfilId}`}>
                                <span className="transition-colors duration-500 hover:text-indigo-400 cursor-pointer text-base sm:text-[20px] font-bold">
                                    Editar perfil
                                </span>
                            </Link>
                        )}

                        <Link href="/">
                            <span className="ml-2 sm:ml-4 transition-colors duration-500 hover:text-indigo-400 cursor-pointer text-base sm:text-[20px] font-bold">
                                Início
                            </span>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}