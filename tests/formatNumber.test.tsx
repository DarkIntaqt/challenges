import { formatNumber } from "@cgg/utils/formatNumber";

test("formatNumber returns empty string for non-number input", () => {
   // @ts-ignore
   expect(formatNumber("not a number")).toBe("");
   // @ts-ignore
   expect(formatNumber(null)).toBe("");
   // @ts-ignore
   expect(formatNumber(undefined)).toBe("");
});

test("formatNumber returns the number as a string with commas when minify is false", () => {
   expect(formatNumber(1234567)).toBe("1,234,567");
   expect(formatNumber(1000)).toBe("1,000");
   expect(formatNumber(9876543210)).toBe("9,876,543,210");
});

test("formatNumber minifies numbers correctly when minify is true", () => {
   expect(formatNumber(1500, true)).toBe("1.5K");
   expect(formatNumber(2000000, true)).toBe("2M");
   expect(formatNumber(3500000000, true)).toBe("3.5B");
   expect(formatNumber(7200000000000, true)).toBe("7.2T");
   expect(formatNumber(999, true)).toBe("999");
});

test("formatNumber minifies numbers starting from the provided unit", () => {
   expect(formatNumber(1500, "K")).toBe("1.5K");
   // since 1500 is less than 1M, it should not be minified
   expect(formatNumber(1500, "M")).toBe("1,500");

   // since 2000000 is larger than 1K, it should be minified to its next matching unit
   expect(formatNumber(2000000, "K")).toBe("2M");
   expect(formatNumber(2000000, "M")).toBe("2M");

   expect(formatNumber(3500000000, "M")).toBe("3.5B");
   expect(formatNumber(3500000000, "B")).toBe("3.5B");

   expect(formatNumber(7200000000000, "B")).toBe("7.2T");
   expect(formatNumber(7200000000000, "T")).toBe("7.2T");

   // since 999 is less than 1K, it should not be minified
   expect(formatNumber(999, "K")).toBe("999");
   expect(formatNumber(999, "M")).toBe("999");
   expect(formatNumber(999, "B")).toBe("999");
   expect(formatNumber(999, "T")).toBe("999");
});
