import React from "react";
import { Link } from "react-router";
import { Button, Flex } from "@maistro/ui";
import { appRoutes } from "../Routes/appRoutes";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white ">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to={appRoutes.getHomeRoute()}>
          <div className="text-2xl font-bold text-black tracking-tight">
            maistro
          </div>
        </Link>

        <Flex
          className="lg:flex items-center gap-3"
          direction="row"
          align="center"
          justify="center"
          gap="3"
        >
          <Link to={"https://customer.maistroapp.com"}>
            <Button
              variant="ghost"
              className="text-sm font-medium text-black px-4 py-2"
            >
              Ingresar
            </Button>
          </Link>

          <Link to={"https://customer.maistroapp.com/businesses/onboarding"}>
            <Button className="text-sm px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-full">
              Crear cuenta
            </Button>
          </Link>
        </Flex>
      </div>
    </header>
  );
}
