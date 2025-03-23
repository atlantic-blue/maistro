// import { DataStorage } from "./Storage"

// const mockLocalStorage = (() => {
//     let store: Record<string, string> = {};
//     return {
//         getItem(key: string) {
//             return store[key] || null;
//         },
//         setItem(key: string, value: string) {
//             store[key] = value;
//         },
//         clear() {
//             store = {};
//         },
//     };
// })() as Storage;

// describe("Storage", () => {
//     it("should set and get a value correctly", () => {
//         const storage = new DataStorage<{ id: string; value: string }>('testStorage', mockLocalStorage);
//         const testValue = { id: '123', value: 'Test' };

//         storage.set(testValue);

//         const retrievedValues = storage.getById('123');
//         expect(retrievedValues).toEqual([testValue]);
//     })

//     it('should return an empty array for a non-existent id', () => {
//         const storage = new DataStorage<{ id: string; value: string }>('testStorage', mockLocalStorage);

//         const retrievedValues = storage.getById('nonExistentId');
//         expect(retrievedValues).toEqual([]);
//     });
// })