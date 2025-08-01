import React from 'react';
import { Button } from '@maistro/ui';
import { MenuIcon } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white ">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-black tracking-tight">maistro</div>
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
          <a href="#" className="hover:text-black">
            Tipos de negocio
          </a>
          <a href="#" className="hover:text-black">
            Pagos
          </a>
          <a href="#" className="hover:text-black">
            Precios
          </a>
          <a href="#" className="hover:text-black">
            Marketplace
          </a>
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" className="text-sm font-medium text-black px-4 py-2">
            Ingresar
          </Button>
          <Button className="text-sm px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-full">
            Crear cuenta
          </Button>
        </div>
        <div className="lg:hidden">
          <Button variant="ghost">
            <MenuIcon className="w-5 h-5 text-black" />
          </Button>
        </div>
      </div>
    </header>
  );
}
