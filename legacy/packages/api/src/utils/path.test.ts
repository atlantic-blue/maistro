import { s3Path } from "./path"

describe("s3Path", () => {
    it("should create a regular s3 path", () => {
        const input = {
            projectId: "foo",
            fileName: "index.html",
            path: "",
        }

        const output = s3Path(input)

        expect(output).toEqual("foo/index.html")
    })

    it("should create a nested s3 paths", () => {
        const input = {
            projectId: "foo",
            fileName: "index.html",
            path: "blog",
        }

        const output = s3Path(input)

        expect(output).toEqual("foo/blog/index.html")
    })

    it("should create a nested s3 paths", () => {
        const input = {
            projectId: "foo",
            fileName: "blog/introduction.html",
            path: "",
        }

        const output = s3Path(input)

        expect(output).toEqual("foo/blog/introduction.html")
    })
})