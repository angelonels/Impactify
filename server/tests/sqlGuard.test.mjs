import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { validateReadOnlySql } = require("../utils/sqlGuard");

describe("sqlGuard.validateReadOnlySql", () => {
    it("allows a simple SELECT", () => {
        expect(validateReadOnlySql("SELECT * FROM ds_1 LIMIT 10")).toEqual({ ok: true });
    });

    it("allows a SELECT with GROUP BY and aggregates", () => {
        expect(
            validateReadOnlySql("SELECT name, SUM(sales) FROM ds_1 GROUP BY name ORDER BY 2 DESC LIMIT 10")
        ).toEqual({ ok: true });
    });

    it("rejects DROP", () => {
        const r = validateReadOnlySql("DROP TABLE users");
        expect(r.ok).toBe(false);
        expect(r.reason).toMatch(/drop/i);
    });

    it("rejects DELETE", () => {
        const r = validateReadOnlySql("DELETE FROM ds_1");
        expect(r.ok).toBe(false);
    });

    it("rejects UPDATE", () => {
        const r = validateReadOnlySql("UPDATE ds_1 SET x = 1");
        expect(r.ok).toBe(false);
    });

    it("rejects multi-statement", () => {
        const r = validateReadOnlySql("SELECT 1; SELECT 2");
        expect(r.ok).toBe(false);
        expect(r.reason).toMatch(/multiple/i);
    });

    it("rejects empty input", () => {
        expect(validateReadOnlySql("").ok).toBe(false);
        expect(validateReadOnlySql("   ").ok).toBe(false);
    });

    it("rejects unparseable SQL", () => {
        const r = validateReadOnlySql("THIS IS NOT SQL");
        expect(r.ok).toBe(false);
    });

    it("rejects non-string input", () => {
        expect(validateReadOnlySql(null).ok).toBe(false);
        expect(validateReadOnlySql(123).ok).toBe(false);
    });
});
