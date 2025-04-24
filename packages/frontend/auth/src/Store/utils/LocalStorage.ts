import { UserStruct } from "../User";

class DataStorage<V> {
    private key: string
    private storage: Storage

    constructor(key: string, storage: Storage = localStorage) {
        this.key = key
        this.storage = storage
    }

    get() {
        return JSON.parse(this.storage.getItem(this.key) || '{}');
    }

    set(value: V) {
        const seen = new WeakSet();
        const data = JSON.stringify(value, (key, value) => {
            if (typeof value === "object" && value !== null) {
                // Circular reference
                if (seen.has(value)) {
                    // TODO app level error!
                    return "[Circular]";
                }

                seen.add(value);
            }
            return value;
        })

        // IDEMPOTENT
        this.storage.removeItem(this.key)
        this.storage.setItem(this.key, data);
    }
}

const UserStorage = new DataStorage<UserStruct>("maistro.user")

export {
    DataStorage,
    UserStorage,
}
