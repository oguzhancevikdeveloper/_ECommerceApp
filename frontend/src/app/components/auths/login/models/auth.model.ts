import { UserModel } from "../../../users/models/user.model"; 

export class AuthModel{
    token: string = "";
    user: UserModel = new UserModel();
}