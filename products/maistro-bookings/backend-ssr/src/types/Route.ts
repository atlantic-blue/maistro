export interface RouteData {
  timestamp: number;
  routeData: Record<string, unknown>;
  routeErrors?: Record<string, string>;
}
