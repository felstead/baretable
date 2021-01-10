import { IId } from './project';


export class PageEntity implements IId {
    id: string;
    type: PageEntityType;
    dataSourceId: string;
    links?: EntityLink[];
}

export class EntityLink {
    level: EntityActionLevel;
    linkTargetPageId: string;
    parameters: EntityLinkParameters[];
}

export class EntityLinkParameters {
    id: string;
    value: string;
}

export enum EntityActionLevel {
    Row = 'row',
    Column = 'column'
}

export enum PageEntityType {
    Table = 'table',
    SingleRecord = 'singleRecord',
    Static = 'static'
}
