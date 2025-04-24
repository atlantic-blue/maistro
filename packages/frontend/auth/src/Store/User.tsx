import { decodeJwt, JwtDecoded } from "../jwt";

export interface UserStruct {
    id: string
    avatar: string
    email: string
    name: string
    tokenAccess: string
    tokenId: string
}

const ADMIN_GROUP = "atlantic-blue-maistro-user-group-system"

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

    setGroups(groups: string[]): void
    getGroups(): string[]
}

export class User implements IUser {
    private id: string = ""
    private email: string = ""
    private avatar: string = ""
    private name: string = ""
    private tokenAccess: string = ""
    private tokenAccessDecoded: JwtDecoded | null = null
    private tokenId: string = ""
    private tokenIdExp: number = 0
    private groups: string[] = []

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

    public getTokenAccessDecoded(): JwtDecoded | null {
        return this.tokenAccessDecoded
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

        const [decodedJwt] = decodeJwt(token)
        this.tokenAccessDecoded = decodedJwt

        this.setId(decodedJwt?.decoded?.payload["sub"] || "")
        this.setEmail(decodedJwt?.decoded?.payload["email"] || "")
        this.setName(decodedJwt?.decoded?.payload["name"] || "")
        this.setAvatar(decodedJwt?.decoded?.payload["picture"] || "")

        const exp = Number(decodedJwt?.decoded?.payload["exp"] || 0)
        this.setTokenIdExpiration(exp)

        const groups: string[] = decodedJwt?.decoded?.payload["cognito:groups"] as any as string[] || []
        this.setGroups(groups)
    }

    public getGroups() {
        return this.groups
    }

    public setGroups(groups: string[]) {
        this.groups = groups
    }

    public isAdmin() {
        return this.groups.includes(ADMIN_GROUP)
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
