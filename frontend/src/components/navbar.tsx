'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const isLoginPage = pathname === "/login";
    const isHomepage = pathname === "/";

    const isRegisterPage =
        pathname.toLowerCase().startsWith("/empresa/registro") ||
        pathname.toLowerCase().startsWith("/freelancer/registro") ||
        pathname.toLowerCase().startsWith("/cliente/registro");

    return (
        <nav className="bg-[#1A1A1A] w-full h-16 flex items-center justify-between px-8 fixed top-0 left-0 z-50 shadow-md border-b border-zinc-800">


            {}
            <div className="flex items-center gap-2 text-xl font-bold">
                <img src="/icon.logo.png" alt="logo" className="h-8 w-auto" />
                <div>talentsy</div>
            </div>



            {}
            <div className="flex gap-10 text-sm">

                {}

                {isHomepage && (
                    <>
                        {/* <Link href="/Empresa/registro">
                            <span className="transition-colors duration-500 hover:text-indigo-400 cursor-pointer text-[18px]">
                                Registrar Empresa
                            </span>
                        </Link>

                        <Link href="/Freelancer/registro">
                            <span className="transition-colors duration-500 hover:text-indigo-400 cursor-pointer text-[18px]">
                                Registrar Freelancer
                            </span>
                        </Link>

                        <Link href="/Cliente/registro">
                            <span className="transition-colors duration-500 hover:text-indigo-400 cursor-pointer text-[18px]">
                                Registrar Cliente
                            </span>
                        </Link> */}


                        <Link href="/login">
                            <span className="transition-colors duration-500 hover:text-indigo-400 cursor-pointer text-[18px]">
                                Logar-se
                            </span>
                        </Link>
                    </>
                )}



                {}
                {isRegisterPage && (

                    <>
                        <Link href="/">
                            <span className="transition-colors duration-500 hover:text-indigo-400 cursor-pointer text-[18px]">
                                Inicio
                            </span>
                        </Link>


                        <Link href="/login">
                            <span className="transition-colors duration-500 hover:text-indigo-400 cursor-pointer text-[18px]">
                                Já tem conta?
                            </span>
                        </Link>

                    </>
                )}

                {isLoginPage && (

                    <Link href="/">

                        <span className="transition-colors duration-500 hover:text-indigo-400 cursor-pointer text-[18px]">
                            inicio
                        </span>

                    </Link>
                )}
            </div>
        </nav>
    );
}
