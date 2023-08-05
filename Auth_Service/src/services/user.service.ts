//internal imports
import { Signup_or_Login_Body_Input } from "schema/auth.schema";
import userRepository, {
  UserRepositoryInterface,
} from "../database/repository/user.repository";
import createHttpError from "http-errors";
import { RPC_Request_Payload } from "utils/broker";

export interface UserServiceInterface {
  SignUp(userInput: Signup_or_Login_Body_Input): Promise<void>;
  serveRPCRequest(payload: RPC_Request_Payload): Promise<void>;
}

class UserService implements UserServiceInterface {
  private repository: UserRepositoryInterface;

  constructor() {
    this.repository = userRepository;
  }

  async SignUp(userInput: Signup_or_Login_Body_Input) {
    const { email, password, role } = userInput;

    const existingUser = await this.repository.findUserByEmail(email);

    if (existingUser)
      throw createHttpError(409, `User with email ${email} already exists`);

    const newUser = await this.repository.createUser(userInput);
  }

  // server side RPC request handler
  async serveRPCRequest(payload: RPC_Request_Payload) {
    switch (payload.type) {
      default:
        break;
    }
  }
}

export default new UserService();
