import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { inferType } = require("../services/cleanerService");

describe("cleanerService.inferType", () => {
    it("returns TEXT for empty input", () => {
        expect(inferType([])).toBe("TEXT");
        expect(inferType([null, "", undefined])).toBe("TEXT");
    });

    it("detects INTEGER on plain integers", () => {
        expect(inferType(["1", "2", "3", "-4", "5"])).toBe("INTEGER");
    });

    it("detects FLOAT on plain decimals", () => {
        expect(inferType(["1.1", "2.2", "3.3", "-4.5"])).toBe("FLOAT");
    });

    it("detects FLOAT for scientific notation", () => {
        expect(inferType(["1.23e-4", "2.5e10", "-3.14e2", "4.0e0", "5e2"])).toBe("FLOAT");
    });

    it("detects FLOAT for currency strings", () => {
        expect(inferType(["$1,200", "$3,400", "$5,600.78", "$9,000"])).toBe("FLOAT");
    });

    it("detects FLOAT for percentage strings", () => {
        expect(inferType(["12.5%", "33%", "0.5%", "100%", "75.25%"])).toBe("FLOAT");
    });

    it("detects BOOLEAN on yes/no/true/false", () => {
        expect(inferType(["true", "false", "yes", "no", "true"])).toBe("BOOLEAN");
    });

    it("detects TIMESTAMP on ISO dates", () => {
        expect(inferType([
            "2024-01-15",
            "2024-02-20",
            "2024-03-10T14:30:00Z",
            "2024-04-05",
            "2024-05-25",
        ])).toBe("TIMESTAMP");
    });

    it("detects TIMESTAMP on English dates", () => {
        expect(inferType([
            "Jan 15, 2024",
            "Feb 20, 2024",
            "Mar 10, 2024",
            "Apr 5, 2024",
            "May 25, 2024",
        ])).toBe("TIMESTAMP");
    });

    it("does NOT classify bare two-digit numbers as TIMESTAMP", () => {
        expect(inferType(["20", "21", "22", "23", "24"])).toBe("INTEGER");
    });

    it("falls back to TEXT for mixed values below threshold", () => {
        expect(inferType(["hello", "world", "1", "foo", "bar"])).toBe("TEXT");
    });
});
