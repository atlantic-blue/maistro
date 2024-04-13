import React from "react";
import { renderToString } from 'react-dom/server';

import { ProjectStruct, UserStruct } from "../../types";

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
                    if (React.isValidElement(() => value)) {
                        return renderToString(value)
                    }

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

const ProjectsStorage = new DataStorage<Record<string, ProjectStruct>>("maistro.projects")
const UserStorage = new DataStorage<UserStruct>("maistro.user")

export {
    DataStorage,
    ProjectsStorage,
    UserStorage,
}
