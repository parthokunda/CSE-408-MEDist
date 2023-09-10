//import user model
import User from "../models/User.model";

//internal imports
import jwtService from "../../utils/jwt";
import log from "../../utils/logger";

export interface UserRepositoryInterface {
  createUser(_newUser: Partial<User>): Promise<User>;
  findUserByEmail_and_Password(
    _email: string,
    _password: string
  ): Promise<User>;
  findUserByEmail(_email: string): Promise<User>;
  deleteUserById(_id: number): Promise<void>;
}

class UserRepository implements UserRepositoryInterface {
  async createUser(_newUser: Partial<User>): Promise<User> {
    const salt = await jwtService.generateSalt();
    const passwordHash = await jwtService.generatePasswordHash(
      _newUser.email,
      _newUser.password,
      salt
    );

    _newUser.salt = salt;
    _newUser.password = passwordHash;

    return await User.create(_newUser);
  }

  async findUserByEmail_and_Password(
    _email: string,
    _password: string
  ): Promise<User> {
    try {
      const tempUser = await User.findOne({ where: { email: _email } });
      const tempPassword = await jwtService.generatePasswordHash(_email,_password, tempUser.salt);

      log.debug(tempPassword, "generated password");
      log.debug(tempUser.password, "saved password");

      return tempUser.password === tempPassword ? tempUser : null;  
    } catch (error) {
      log.error(error);
      return null;
    }
  }

  async findUserByEmail(_email: string): Promise<User> {
    const user = await User.findOne({ where: { email: _email } });
    return user;
  }

  async findUserById(_id: number): Promise<User> {
    const user = await User.findByPk(_id);
    return user;
  }

  async deleteUserById(_id: number): Promise<void> {
    await User.destroy({ where: { id: _id } });
  }

  async updatePassword(_id: number, _newPassword: string): Promise<User> {
    const user = await User.findByPk(_id);

    if (user) {
      const newSalt = await jwtService.generateSalt();
      const newPasswordHash = await jwtService.generatePasswordHash(
        user.email,
        _newPassword,
        newSalt
      );
      await User.update(
        { password: newPasswordHash, salt: newSalt },
        { where: { id: _id } }
      );
      return user;
    } else return null;
  }
}

export default new UserRepository();
