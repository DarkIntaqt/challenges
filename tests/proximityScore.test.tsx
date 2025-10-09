import { getProximityScore } from "@cgg/utils/getProximityScore";

test("getProximityScore returns correct score", () => {
   const result = getProximityScore("test", "test");
   expect(result).toBe(100);
});

test("getProximityScore returns 0 for no match", () => {
   const result = getProximityScore("test", "nope");
   expect(result).toBe(0);
});

test("getProximityScore returns 50 for startsWith match", () => {
   const result = getProximityScore("testing", "test");
   expect(result).toBe(50);
});
