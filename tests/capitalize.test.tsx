import { capitalize } from "@cgg/utils/capitalize";

test("capitalize function capitalizes the first letter of each word", () => {
   expect(capitalize("hello world")).toBe("Hello World");
   expect(capitalize("capitalize this sentence")).toBe("Capitalize This Sentence");
});

test("capitalize function handles single words", () => {
   expect(capitalize("test")).toBe("Test");
   expect(capitalize("CAPITALIZE")).toBe("Capitalize");
});
