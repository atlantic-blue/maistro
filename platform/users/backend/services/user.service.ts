import { DecodedToken } from "../lambdas/users";
import UserModel from "../models/user.model";
import UserRepository from "../repositories/user";

class UserService {
    private userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    async getUserByCognitoId(cognitoUserId: string): Promise<UserModel | null> {
        const maistroUser = await this.userRepository.getUserByCognitoId(cognitoUserId)
        if(!maistroUser) {
            return null
        }

        const user = new UserModel(maistroUser)
        return user
    }
}

export {
    UserService
}