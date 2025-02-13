import { Controller } from "../../../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../../../core/Types";
import { Config } from "../../../core/Config";
import fs from "fs";
const APP_CONFIG: Config = new Config(JSON.parse(fs.readFileSync("config.json").toString()));

export class PatientApiController extends Controller {
    private auth = { private: true, public: false };

    constructor() {
      super();
    //   this.loginService = this.getService("LoginService");
    }

  public onRegister(): void {
    this.onGet("/", [], this.auth.public, this.healthCheck);
  }

  public async healthCheck(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
    return resp.status(200).send('Welcome to Praava Health API Engine!!! ');
  }
}
