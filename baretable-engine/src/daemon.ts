import * as Http from 'http';
import * as Url from 'url';
import { BaretableCore } from './core';
import { exit } from 'process';

import { Project } from './model/project'
import { Sqlite3Connection } from './model/connection';

// This entrypoint should only be used in the self-hosted daemon scenario
// If you're using serverless (e.g. AWS Lambda+API Gateway or similar) then don't run this,
// use the individual endpoint functions explicitly.  See README.md for more details.

const baretable = new BaretableCore();

Http.createServer(async (req: Http.IncomingMessage, res: Http.ServerResponse) => {
    const err = (statusCode : number, message : string) => {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ 'error' : message}));
        res.end();
    }

    const sendJson = (obj : any) => {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.write(JSON.stringify(obj));
        res.end();
    }

    // Router
    const url = Url.parse(<string>req.url);
    if(url && url.pathname) {
        // Split path to get project
        const paths : string[] = url.pathname.split(/\//).filter(p => p.trim().length > 0);
        if(paths.length == 0 || paths.length > 2) {
            err(404, 'Not found');
        } else {
            const projectId : string | null = paths[0];
            const queryId : string | null = paths[1];

            if(projectId && queryId) {
                // Decode parameters
                const params : any =
                    (url.search || '')
                    .split(/[?&]/g)
                    .filter(x => x)
                    .map(x => x.split('='))
                    .map(x => [decodeURIComponent(x[0]), decodeURIComponent(x[1])])
                    .reduce((a, x) => ({...a, [x[0]]: x[1] }), {});

                sendJson(await baretable.runQuery(projectId, queryId, params));
                
            } else if(projectId) {
                // CONFIG
                sendJson(await baretable.getConfig(projectId));
            } else {
                err(404, 'Not found');
            }
        }
    } else {
        err(404, 'Not found');
    }
}).listen(3000);

console.log("Listening on port 3000");