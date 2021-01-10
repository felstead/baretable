import { IId } from './project';


export enum Cardinality {
    Single = 'single',
    Many = 'many'
}

export enum QueryParameterType {
    String = 'string',
    Number = 'number'
}

export class QueryParameter {
    id : string;
    displayName : string;
    type : QueryParameterType;
}

export class DataSource implements IId {
    id: string;
    connectionId: string;
    cardinality: Cardinality;
    query: string;
    parameters: QueryParameter[];
}
