import UserModel from "../models/user.model";
import UsersRepository from "../repositories/users.repoistory";

export default class UsersService {
    private userRepository: UsersRepository

    constructor(userRepository: UsersRepository) {
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
