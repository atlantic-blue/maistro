import toSnakeCase, { keysToSnakeCase } from "./toSnakeCase"

describe("toSnakeCase", () => {
    it('should convert pascal to snake case', () => {
        const input = "InputCase"
        const value = toSnakeCase(input)
        const expected = "input_case"
        expect(value).toBe(expected)
    })

    it('should convert camel to snake case', () => {
        const input = "inputCase"
        const value = toSnakeCase(input)
        const expected = "input_case"
        expect(value).toBe(expected)
    })

    it('should convert kebab to snake case', () => {
        const input = "input-case"
        const value = toSnakeCase(input)
        const expected = "input_case"
        expect(value).toBe(expected)
    })

    it('should convert title to snake case', () => {
        const input = "Titlecase"
        const value = toSnakeCase(input)
        const expected = "titlecase"
        expect(value).toBe(expected)
    })
    it('should convert a sentence to snake case', () => {
        const input = "some-mixed_string with spaces_underscores-and-hyphens"
        const value = toSnakeCase(input)
        const expected = "some_mixed_string_with_spaces_underscores_and_hyphens"
        expect(value).toBe(expected)
    })
})

describe("Object to snake Case", () => {
    it("should convert obj keys to snake case", () => {
        const input = {
            camelCase: null,
            PascalCase: null,
            "kebab-case": null
        }
        const value = keysToSnakeCase(input)
        const expected = {
            camel_case: null,
            pascal_case: null,
            kebab_case: null,
        }
        expect(value).toEqual(expected)
    })

    it("should convert nested obj keys to snake case", () => {
        const input = {
            camelCase: null,
            PascalCase: null,
            "kebab-case": {
                camelCase: null,
                PascalCase: null,
                "kebab-case": {
                    camelCase: null,
                    PascalCase: null,
                }
            }
        }
        const value = keysToSnakeCase(input)
        const expected = {
            camel_case: null,
            pascal_case: null,
            kebab_case: {
                camel_case: null,
                pascal_case: null,
                kebab_case: {
                    camel_case: null,
                    pascal_case: null,
                }
            }
        }
        expect(value).toEqual(expected)
    })
})