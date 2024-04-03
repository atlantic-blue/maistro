import { ProjectStruct } from "../../types";

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
        this.storage.setItem(this.key, JSON.stringify(value));
    }
}

const ProjectsStorage = new DataStorage<Record<string, ProjectStruct>>("projects")

export {
    DataStorage,
    ProjectsStorage,
}
