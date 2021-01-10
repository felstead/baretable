import { IId } from './project';

// Sqlite
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export interface SchemaType {
    columnName : string;
    type : string;
}

export interface ResultSet {
    schema : SchemaType[];
    totalRecordCount: number;
    resultSetRecordCount: number;
    offset: number;

    results : any[];
}

export class Connection implements IId {
    id: string;
    adapter: string;

    // THis is ugly AF, fix it
    static getTypeForAdapter(adapter : string) : (new() => Connection) {
        switch(adapter) {
            case 'sqlite3': return Sqlite3Connection;
            case 'snowflake': return SnowflakeConnection;
            default: throw Error("Unknown type");
        }
    }

    async query(queryText : string, params : any[], maxRecords : number = -1, offset : number = 0) : Promise<ResultSet>
    {
        throw new Error('Not implemented');
    }
}

export class SnowflakeConnection extends Connection {
    account: string;
    user: string;
    privateKeyPath: string;
    privateKeyPassphrase: string;
}

export class Sqlite3Connection extends Connection {
    filename: string;

    async query(queryText : string, params : any, maxRecords : number = -1, offset : number = 0) : Promise<ResultSet> {
        let annotatedQueryText = queryText;
        if(maxRecords > 0 || offset > 0) {
            const limitText = maxRecords > 0 ? `LIMIT ${maxRecords}` : '';
            const offsetText = offset > 0 ? `OFFSET ${offset}` : '';
            annotatedQueryText = `SELECT * FROM (${queryText}) ${limitText} ${offsetText};`;
        }

        // HACK, move upstream
        delete params.maxRecords;
        delete params.offset;

        const db = await open({ filename: this.filename, driver: sqlite3.Database, mode: sqlite3.OPEN_READONLY});

        const results = await db.all(annotatedQueryText, params);

        // TODO: Get schema even for empty result set?
        const schema : SchemaType[] = [];

        if(results.length > 0) {
            for(const field in results[0]) {
                schema.push({columnName : field, type: typeof(results[0][field])});
            }
        }

        return {
            schema: schema,
            totalRecordCount: -1,
            resultSetRecordCount: results.length,
            offset: offset,
            results: results.map(r => Object.values(r))
        }
    }
}