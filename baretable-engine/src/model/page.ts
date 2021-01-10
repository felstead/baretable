import { IId } from './project';
import { PageEntity } from "./pageEntity";

export class Page implements IId {
    id: string;
    entities: PageEntity[];
}
