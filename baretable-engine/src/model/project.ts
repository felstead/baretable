// Shared libs
import * as YAML from 'js-yaml';
import * as Validator from 'jsonschema';
import * as FS from 'fs';

// Local libs
import { Connection, Sqlite3Connection, ResultSet } from './connection';
import { DataSource } from './dataSource';
import { Page } from './page';
import { PageEntity } from './pageEntity';

export interface IId {
    id : string;
}

export class Project implements IId {
    title : string;
    id : string;

    connections : Connection[];
    dataSources : DataSource[];
    pages : Page[];

    public async runQuery(dataSourceId : string, params : any, maxRecords : number = -1, offset : number = 0) : Promise<ResultSet> {
        const dataSource : DataSource = this.dataSourceMap[dataSourceId];
        const connection : Connection = this.connectionMap[dataSource?.connectionId];

        if(dataSource && connection) {
            return connection.query(dataSource.query, params, maxRecords, offset);
        }
        
        throw new Error(`DataSource ${dataSourceId} not found or has invalid connection`);
    }

    // == Private members

    // Private calculated lookups
    private idSet : Set<string> = new Set<string>();
    private connectionMap : Map<string, Connection> = new Map<string, Connection>();
    private dataSourceMap : Map<string, DataSource> = new Map<string, DataSource>();
    private pageMap : Map<string, Page> = new Map<string, Page>();

    private constructor(projectObj : any) {
        // Assumes the incoming object is a valid project, should have been validated in loadFromYaml or similar
        Object.assign(this, projectObj);

        // Validate the links between connections, datasources and pages
        this.connections.forEach(o => this.validateUniqueness(o, this.connectionMap, Connection.getTypeForAdapter(o.adapter))); // TODO: Make dynamic
        this.dataSources.forEach(o => this.validateUniqueness(o, this.dataSourceMap, DataSource));
        this.pages.forEach(o => this.validateUniqueness(o, this.pageMap, Page));
    }

    private validateUniqueness<T extends IId>(element : T, targetMap : Map<string, T>, type : (new() => T)) : void {
        if(this.idSet.has(element.id)) {
            throw new Error(`ID collision: ${element.id} was found multiple times in config`);
        }

        this.idSet.add(element.id);
        targetMap[element.id] = Object.assign(new type(), element);
    }

    toConfigBlob() : any {
        // TODO: Create interface for project data model
        const obj : any = {
            title: this.title,
            id: this.id,
            pages: this.pages
        };

        return obj;
    }

    // == Static constructor
    static loadFromYaml(yamlFilePath : string, schemaFilePath : string) : [Project | null, string[]] {
        const projectObj = YAML.safeLoad(FS.readFileSync(yamlFilePath, 'utf8'));
        const validationResult = Validator.validate(projectObj, JSON.parse(FS.readFileSync(schemaFilePath, 'utf8')));

        if(validationResult.valid) {
            const project : Project = new Project(projectObj);
            return [project, []];
        }

        return [null, validationResult.errors.map(e => e.toString())];
    }
}
