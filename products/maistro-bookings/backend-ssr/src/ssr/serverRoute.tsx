import { RouteName, Routes } from "../Routes/appRoutes";
import { matchRoutes } from "react-router";
import { LambdaFunctionURLEvent } from "aws-lambda";
import { businessProfilePrefetch } from "../Routes/BusinessProfile/prefetch";

export interface LoaderArgs {
    url: URL
    params: Record<string, string>;
    headers: Record<string, string>;
    cookies: Record<string, string>;
    event: LambdaFunctionURLEvent;
}

export interface ServerRoute {
    id: string
    path: string
    auth?: boolean
    load?: (args: LoaderArgs) => Promise<unknown>   
}


const parseCookies = (cookieHeader = "") =>
  Object.fromEntries(
    cookieHeader.split(";").map(c => {
      const i = c.indexOf("="); if (i < 0) return [c.trim(), ""];
      return [c.slice(0, i).trim(), decodeURIComponent(c.slice(i + 1))];
    }).filter(Boolean)
  );

export async function serverRouteLoader(event: LambdaFunctionURLEvent, location: string) {
    const headers = Object.fromEntries(
        Object.entries(event.headers || {}).map(([k, v]) => [k.toLowerCase(), v || ""])
    )

    const cookies = parseCookies(headers.cookie);
    const url = new URL(
        `${headers["x-forwarded-proto"] || "https"}://${headers.host}${location}`
    );


    const matches = matchRoutes<ServerRoute>(
        serverRoutes,
        location
    ) || []

    const data: Record<string, unknown> = {};
    const errors: Record<string, string> = {};

    await Promise.resolve(matches.map(async routeMatch => {
        const route = routeMatch.route
        if(!route.load) {
            return
        }

        try {
            const value = await route.load({
                    url,
                    params: routeMatch.params as any,
                    headers,
                    cookies,
                    event,
        });
        data[route.id] = value;
        } catch (error: any) {
            errors[route.id] = error?.message || "Loader failed";
        }
    }))

    return { 
        data, 
        errors,
     };
}

export const serverRoutes: ServerRoute[] = [
    {
        id: RouteName.HOME,
        path: Routes.HOME,
    },
    {
        id: RouteName.BUSINESS_PROFILE,
        path: Routes.BUSINESS_PROFILE,
        load: async ({params}) => {
            console.log(params)
            const response = await businessProfilePrefetch()
            return response
        }
    }
]
