import { UserStruct } from "../User";

class MemoryStorage implements Storage {
  private map = new Map<string, string>();

  get length() { 
    return this.map.size; 
    }

  clear() { 
    this.map.clear(); 
    }

  getItem(key: string) { 
    return this.map.has(key) ? this.map.get(key)! : null; 
    }

  key(index: number) { 
    return Array.from(this.map.keys())[index] ?? null; 
}

  removeItem(key: string) { 
    this.map.delete(key); 
}

  setItem(key: string, value: string) {
     this.map.set(key, value); 
    }
}

const isBrowser = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

class DataStorage<V> {
    private key: string
    private storage: Storage

    constructor(key: string, storage: Storage = isBrowser() ? window.localStorage : new MemoryStorage()) {
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
