
// System
import 'reflect-metadata';
import path from "path";
import fs from "fs";
import { exit } from "process";

// Core
import { mongoInit } from "./init";
import { Application } from "./core/Application";
import { Config } from "./core/Config";
import { Role } from "./core/IUserProvider";
import cron from "node-cron";

// Services
import { SignUpService } from "./modules/user/services/signup.service";
import { RoleService } from './modules/role/services/role.service';
import { PermissionService } from './modules/permission/services/permission.service';

// Formatters
import { dateFormatter } from "./ftms/date";

// Controllers
import { SignupController } from "./modules/user/controllers/signup.controller";
import { RoleController } from './modules/role/controllers/role.controller';
import { PermissionController } from './modules/permission/controllers/permission.controller';
import { PermissionRepository } from './modules/permission/repositories/permission.repository';
import { RoleRepository } from './modules/role/repository/role.repository';
import { LoginController } from './modules/user/controllers/login.controller';
import { UserRepository } from './modules/user/repository/user.repository';
import { LoginService } from './modules/user/services/login.service';

// config
const CONFIG_FILE = "config.json";

if (!fs.existsSync(CONFIG_FILE)) {
    console.warn(`Can't find '${CONFIG_FILE}' please make sure config file is present in the current directory`);
    exit(0);
}

const APP_CONFIG: Config = new Config(JSON.parse(fs.readFileSync(CONFIG_FILE).toString()));

// Initialize mongo db
mongoInit(APP_CONFIG.mongoUrl);

const app = Application.getInstance(APP_CONFIG, "/api/v1");

app.viewDir("views");
app.viewEngine("pug");
app.setStatic(path.join(__dirname, "public"), { maxAge: 0 }); // 31557600000 turned off caching for now

// Setup menu

app.setMenu("main", {
    items: [
        { name: "Dashboard", path: "#", for: [Role.Superadmin, Role.Admin, Role.ECMember, Role.Member] },
        { name: "Order", path: "#", for: [Role.Superadmin, Role.Admin, Role.ECMember, Role.Member] },
        { name: "Booking", path: "#", for: [Role.Superadmin, Role.Admin, Role.ECMember, Role.Member] },
        { name: "Accounts", path: "#", for: [Role.Superadmin, Role.Admin, Role.ECMember, Role.Member] },
        { name: "Logout", path: "#", for: [Role.Superadmin, Role.Admin, Role.ECMember, Role.Member] }
    ]
})

// Add any formatters, you can access it by fmt.date in views like fmt.date.ymd()
app.setFormatter("date", dateFormatter);

// Lets register the controllers
app.set("UserRepository", new UserRepository());
app.set("SignUpService", new SignUpService(app.get("UserRepository")));
app.registerController(SignupController);

app.set("LoginService", new LoginService(app.get("UserRepository")));
app.registerController(LoginController);

app.set("RoleRepository", new RoleRepository());
app.set("RoleService", new RoleService(app.get("RoleRepository")));
app.registerController(RoleController);

app.set("PermissionRepository", new PermissionRepository());
app.set("PermissionService", new PermissionService(app.get("PermissionRepository")));
app.registerController(PermissionController);

app.setupHandlers();

// Finally setup the cron jobs
// Run Cohort Update cron at midnight everyday to update cohort status
cron.schedule("* 0 * * *", async () => {
    // await UpdateCohort();
});

// start the express server
app.listen(APP_CONFIG.port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${APP_CONFIG.port}`);
});