import React from 'react';
import { LambdaFunctionURLEvent } from 'aws-lambda';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Html from './html';
import { serverRouteLoader } from './serverRoute';
import { RouteData } from '../types/Route';
import { RouteDataProvider } from '../State/DataRoute.context';

const serialize = (obj: unknown) =>
  JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/\u2028|\u2029/g, (s) => (s === '\u2028' ? '\\u2028' : '\\u2029'));

interface Assets {
  scripts: string[];
  styles: string[];
}

const serverSideRenderer = async (event: LambdaFunctionURLEvent, assets: Assets, App: React.FC) => {
  const location = event.rawPath + (event.rawQueryString ? `?${event.rawQueryString}` : '');

  const { data: routeData, errors: routeErrors } = await serverRouteLoader(event, location);

  const state: RouteData = {
    timestamp: Date.now(),
    routeData,
    routeErrors,
  };

  const staticMarkup = renderToString(
    <RouteDataProvider data={state}>
      <StaticRouter location={location}>
        <App />
      </StaticRouter>
    </RouteDataProvider>
  );

  const helmet = Helmet.renderStatic();

  const head = `
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}

        ${assets.styles.map((filename) => `<link rel="stylesheet" href="/${filename}" />`).join('\n')}
    `;

  // Script's order matters
  const scripts = `
        <script id="server-side-sate">
            window.__STATE__ = ${serialize(state)};
        </script>
        ${assets.scripts.map((filename) => `<script src="/${filename}"></script>`).join('\n')}
    `;
  return Html({
    head,
    body: {
      main: staticMarkup,
      scripts,
    },
    htmlAttributes: helmet.htmlAttributes.toString(),
    bodyAttributes: helmet.bodyAttributes.toString(),
  });
};

export default serverSideRenderer;
