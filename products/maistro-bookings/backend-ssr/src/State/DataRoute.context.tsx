import React, { createContext, useContext } from "react";

import { RouteData } from "../types/Route";
import { RouteName } from "../Routes/appRoutes";

export const RouteDataContext = createContext<RouteData | null>(null);

export const RouteDataProvider: React.FC<{
  data: RouteData;
  children: React.ReactNode;
}> = ({ data, children }) => {
  return (
    <RouteDataContext.Provider value={data}>
      {children}
    </RouteDataContext.Provider>
  );
};

export function useRouteData<I>(route: RouteName) {
  const routeDataContext = useContext(RouteDataContext);

  const errors = routeDataContext?.routeErrors;
  const data = routeDataContext?.routeData[route] as I;

  if (errors) {
    console.log({ errors });
  }

  if (data) {
    return data;
  }
}
