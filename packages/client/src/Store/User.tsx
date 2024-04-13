import { UserStruct } from "../types";

interface IUser {
    setId(id: string): void
    getId(): string

    setTokenIdExpiration(exp: number): void
    getTokenIdExpiration(): number

    setTokenAccess(token: string): void
    getTokenAccess(): string

    setTokenId(token: string): void
    getTokenId(): string

    setAvatar(avatar: string): void
    getAvatar(): string

    setEmail(email: string): void
    getEmail(): string

    setName(name: string): void
    getName(): string

    setUser(userStruct: UserStruct): void
}

export class User implements IUser {
    private id: string = ""
    private email: string = ""
    private avatar: string = ""
    private name: string = ""
    private tokenAccess: string = ""
    private tokenId: string = ""
    private tokenIdExp: number = 0

    constructor(userStruct?: UserStruct) {
        if (userStruct) {
            this.setUser(userStruct)
        }
    }

    public setUser(userStruct: UserStruct): void {
        this.setId(userStruct.id)
        this.setEmail(userStruct.email)
        this.setAvatar(userStruct.avatar)
        this.setName(userStruct.name)
        this.setTokenAccess(userStruct.tokenAccess)
        this.setTokenId(userStruct.tokenId)
    }

    public getUser() {
        return this
    }

    public getUserStruct(): UserStruct {
        return {
            id: this.getId(),
            email: this.getEmail(),
            avatar: this.getAvatar(),
            name: this.getName(),
            tokenAccess: this.getTokenAccess(),
            tokenId: this.getTokenId()
        }
    }

    public getId(): string {
        return this.id
    }

    public setId(id: string) {
        this.id = id
    }

    public getTokenIdExpiration(): number {
        return this.tokenIdExp
    }

    public setTokenIdExpiration(exp: number) {
        this.tokenIdExp = exp
    }

    public hasTokenIdExpired(): boolean {
        return (this.getTokenIdExpiration() * 1000) - Date.now() < 0
    }

    public getTokenAccess(): string {
        return this.tokenAccess
    }

    public setTokenAccess(token: string) {
        this.tokenAccess = token
    }

    public getTokenId(): string {
        return this.tokenId
    }

    public setTokenId(token: string) {
        if (!token) {
            // APP LEVEL ERROR
            console.log("NO TOKEN FOUND")
            return
        }

        this.tokenId = token
        const infoRaw = token.split(".")[1]
        const { email, name, picture, sub, exp } = JSON.parse(atob(infoRaw))
        this.setId(sub)
        this.setEmail(email)
        this.setName(name)
        this.setAvatar(picture)
        this.setTokenIdExpiration(exp)
    }

    public getAvatar(): string {
        return this.avatar
    }

    public setAvatar(avatar: string): void {
        this.avatar = avatar
    }

    public getEmail(): string {
        return this.email
    }

    public setEmail(email: string): void {
        this.email = email
    }

    public getName(): string {
        return this.name
    }

    public setName(name: string): void {
        this.name = name
    }
}
