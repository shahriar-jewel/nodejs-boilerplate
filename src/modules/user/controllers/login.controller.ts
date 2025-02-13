import { Controller } from "../../../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../../../core/Types";
import { SignUpService } from "../services/signup.service";
import { createResponse } from "../../../utils/response";
import { validationMiddleware } from "../../../validators/form.validation";
import { Authenticator } from "../../../core/Authenticator";
import { LoginDto } from "../dtos/login.dto";
import { LoginService } from "../services/login.service";
import jwt from "jsonwebtoken";
import { Config } from "../../../core/Config";
import fs from "fs";
const APP_CONFIG: Config = new Config(JSON.parse(fs.readFileSync("config.json").toString()));

export class LoginController extends Controller {
    private Authenticator: Authenticator;
    private loginService: LoginService;
    private auth = { private: true, public: false };

    constructor() {
      super();
      this.loginService = this.getService("LoginService");
    }

  public onRegister(): void {
    this.onPost("/access-token", [], this.auth.public, this.loginCheck);
  }

  public async loginCheck(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
    return resp.status(200).send('Welcome to Praava Health API Engine!!! ');
  }
}
