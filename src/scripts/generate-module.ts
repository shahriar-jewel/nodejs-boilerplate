import * as fs from 'fs';
import * as path from 'path';

const moduleName = process.argv[2];

if (!moduleName) {
    console.error("Please provide a module name");
    process.exit(1);
}

const moduleDir = path.join(__dirname, '../modules', moduleName.toLowerCase());
const controllerDir = path.join(moduleDir, 'controllers');
const serviceDir = path.join(moduleDir, 'services');
const repositoryDir = path.join(moduleDir, 'repositories');

// Create the module folder structure
fs.mkdirSync(moduleDir, { recursive: true });
fs.mkdirSync(controllerDir, { recursive: true });
fs.mkdirSync(serviceDir, { recursive: true });
fs.mkdirSync(repositoryDir, { recursive: true });

// Create Controller file
const controllerContent = `import { Controller } from "../../../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../../../core/Types";
import { createResponse } from "../../../utils/response";
import { ${moduleName}Service } from "../services/${moduleName.toLowerCase()}.service";

export class ${moduleName}Controller extends Controller {
    private ${moduleName.toLowerCase()}Service: ${moduleName}Service;
    private auth = { private: true, public: false };

    constructor() {
        super();
        this.${moduleName.toLowerCase()}Service = this.getService("${moduleName}Service");
    }

    public onRegister(): void {
        this.onPost("/${moduleName.toLowerCase()}/create", this.auth.public, this.${moduleName.toLowerCase()}Create);
    }

    // Create a new ${moduleName.toLowerCase()}
    public async ${moduleName.toLowerCase()}Create(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
        // Logic to create a new ${moduleName.toLowerCase()} will go here
    }
}
`;
fs.writeFileSync(path.join(controllerDir, `${moduleName}Controller.ts`), controllerContent);

// Create Service file
const serviceContent = `import { IRole } from "../interfaces/role.interface";
import { IRoleRepository } from "../interfaces/role-repository.interface";

export class ${moduleName}Service {
    private ${moduleName.toLowerCase()}Repository: IRoleRepository;

    constructor(${moduleName.toLowerCase()}Repository: IRoleRepository) {
        this.${moduleName.toLowerCase()}Repository = ${moduleName.toLowerCase()}Repository;
    }

    // Create a new ${moduleName.toLowerCase()}
    public async create(name: string, isActive: boolean): Promise<IRole> {
        // Logic to create a new ${moduleName.toLowerCase()} will go here
    }
}
`;
fs.writeFileSync(path.join(serviceDir, `${moduleName}Service.ts`), serviceContent);

// Create Repository file
const repositoryContent = `import { Model } from "mongoose";
import { I${moduleName} } from "../interfaces/${moduleName.toLowerCase()}.interface";
import ${moduleName}Model from "../models/${moduleName.toLowerCase()}.model"; // Import the ${moduleName} model
import { I${moduleName}Repository } from "../interfaces/${moduleName.toLowerCase()}-repository.interface"; // Import the ${moduleName} repository interface

export class ${moduleName}Repository implements I${moduleName}Repository {

    // Create a new ${moduleName.toLowerCase()}
    public async create(${moduleName.toLowerCase()}Data: I${moduleName}): Promise<I${moduleName}> {
        return await ${moduleName}Model.create(${moduleName.toLowerCase()}Data);
    }
}
`;
fs.writeFileSync(path.join(repositoryDir, `${moduleName}Repository.ts`), repositoryContent);

// Update app.ts to register the new module
const appFilePath = path.join(__dirname, '../app.ts');
const appFileContent = fs.readFileSync(appFilePath, 'utf8');

// Create registration lines
const controllerRegistration = `app.registerController(${moduleName}Controller);`;
const serviceRegistration = `app.set("${moduleName}Service", new ${moduleName}Service(app.get("${moduleName}Repository")));`;
const repositoryRegistration = `app.set("${moduleName}Repository", new ${moduleName}Repository());`;

// Check if the lines already exist in app.ts
if (!appFileContent.includes(controllerRegistration)) {
    // Add registration lines before the line that starts the server
    const modifiedAppFileContent = appFileContent.replace(/(app\.setupHandlers\(\);)/, `
    ${controllerRegistration}
${repositoryRegistration}
${serviceRegistration}
$1
    `);
    fs.writeFileSync(appFilePath, modifiedAppFileContent);
    console.log(`${moduleName} module created and registered in app.ts successfully!`);
} else {
    console.log(`${moduleName} module already registered in app.ts.`);
}
