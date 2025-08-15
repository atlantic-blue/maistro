import { DecodedToken } from "../lambdas/users";
import UserModel from "../models/user.model";
import UserProfileModel from "../models/userProfile.model";

import UserRepository from "../repositories/user";
import UserProfileRepository from "../repositories/userProfile";

class UserProfileService {
    private userRepository: UserRepository
    private userProfileRepository: UserProfileRepository

    constructor(
        userRepository: UserRepository,
        userProfileRepository: UserProfileRepository
    ) {
        this.userRepository = userRepository
        this.userProfileRepository = userProfileRepository
    }

    async getAuthenticatedUser(decodedToken: DecodedToken): Promise<UserProfileModel| null> {
        const maistroUser = await this.userRepository.getUserByCognitoId(decodedToken.username)
        if(!maistroUser) {
            return null
        }

        const userProfile = await this.userProfileRepository.getUserProfileById(maistroUser.UserId)
        if(!userProfile) {
            return null
        }

        return new UserProfileModel(userProfile)
    }
}

export {
    UserProfileService
}