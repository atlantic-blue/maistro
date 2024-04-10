import { UserStruct } from "../types";

interface IUser {
    setId(id: string): void
    getId(): string

    setAvatar(avatar: string): void
    getAvatar(): string

    setEmail(email: string): void
    getEmail(): string

    setName(name: string): void
    getName(): string

    setUser(userStruct: UserStruct): void
}

export class User implements IUser {
    private id: string
    private email: string
    private avatar: string
    private name: string

    constructor(userStruct: UserStruct) {
        this.id = userStruct.id
        this.email = userStruct.email
        this.avatar = userStruct.avatar
        this.name = userStruct.name
    }

    public setUser(userStruct: UserStruct): void {
        this.setId(userStruct.id)
        this.setEmail(userStruct.email)
        this.setAvatar(userStruct.avatar)
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
        }
    }

    public getId(): string {
        return this.id
    }

    public setId(id: string) {
        this.id = id
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
