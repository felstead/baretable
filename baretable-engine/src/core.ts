// This file contains the functions that you will export to your serverless hosting

import { Project } from "./model/project";


export class BaretableCore {

    private projectMap : Map<string, Project>;

    constructor() {
        this.initialize();
    }

    public async getConfig(projectId : string) : Promise<any> {
        const project = this.projectMap[projectId];
        if(project) {
            return project.toConfigBlob();
        } else {
            return null;
        }
    }

    public async runQuery(projectId : string, dataSourceId : string, params : any) : Promise<any> {
        const project : Project = this.projectMap[projectId];
        if(project) {
            return project.runQuery(dataSourceId, params, parseInt(params.maxRecords) || -1, parseInt(params.offset) || 0);
        }

        return null;
    }

    // Private functions
    private initialize() : void {
        this.projectMap = new Map<string, Project>(); 

        // Reads config paths from env variables and falls back to known paths
        const projectAndErrors : [Project | null, string[]] = Project.loadFromYaml('./example-project/adventureworks.yml', './config/schema.json');
        const project = projectAndErrors[0];
    
        if(!project) {
            console.log(projectAndErrors[1]);
            throw new Error(`Error loading project file, broken schema: \n${projectAndErrors.join('\n')}`);
        } else {
            this.projectMap[project.id] = project;
        }
    }
}
