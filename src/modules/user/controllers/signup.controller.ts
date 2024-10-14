import { Controller } from "../../../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../../../core/Types";
import { SignUpService } from "../services/signup.service";
import { CreateUserDto } from "../dtos/user.dto";
import { createResponse } from "../../../utils/response";
import { validationMiddleware } from "../../../validators/form.validation";
import { Authenticator } from "../../../core/Authenticator";

export class SignupController extends Controller {
  private Authenticator: Authenticator;
  private signupService: SignUpService;
  private auth = { private: true, public: false };

  constructor() {
    super();
    this.signupService = this.getService("SignUpService");
  }

  public onRegister(): void {
    this.onPost("/signup", [validationMiddleware(CreateUserDto)], this.auth.public, this.userSignup);
  }

  // User signup
  public async userSignup(req: HttpRequest, resp: HttpResponse, next: NextFunc) {

    const { name, username, email, mobile, password, role, isActive } = req.body;
    try {
      const hashPassword = this.Authenticator.digestPassword(password);
      await this.signupService.create(name, username, email, mobile, hashPassword, role, isActive);
      const userData = { name, username, email, role, isActive };
      return resp.status(201).send(createResponse(201, "User registered successfully", userData));

    } catch (error) {
      return next(createResponse(409, error.message, null));
    }
  }
}
