import { Controller } from "../../../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../../../core/Types";
import { SignUpService } from "../services/signup.service";
import { createResponse } from "../../../utils/response";
import { validationMiddleware } from "../../../validators/form.validation";
import { Authenticator } from "../../../core/Authenticator";
import { LoginDto } from "../dtos/login.dto";
import { LoginService } from "../services/login.service";
import jwt from "jsonwebtoken";
import { IUser } from "../../../core/IUserProvider";
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
    this.onPost("/auth/login", [validationMiddleware(LoginDto)], this.auth.public, this.loginCheck);
  }

  // User signup
  public async loginCheck(req: HttpRequest, resp: HttpResponse, next: NextFunc) {

    const { email, password } = req.body;
    try {
        const user: IUser = await this.loginService.findByEmail(email);
        if (!user || !user.isActive) {
            console.log('user not found or password not matched!');
        } else {
            const today = new Date();
            const accessTokenExpiresIn = today.setHours(today.getHours() + 24);
            const token = jwt.sign({ id: user.id }, APP_CONFIG.authSecret as string, { expiresIn: '1d' });
            // const refreshToken = crypto.createHmac('sha256', "secret").update(new Date().getTime().toString()).digest('hex');
            // await this.UserProvider.createSession(username, refreshToken);
            return resp.status(200).send(createResponse(200, "User access token", token));
        }

    } catch (error) {
      return next(createResponse(409, error.message, null));
    }
  }
}
