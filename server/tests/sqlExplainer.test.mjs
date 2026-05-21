import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { explainSql } = require("../services/sqlExplainer");

describe("sqlExplainer.explainSql", () => {
    it("handles SELECT *", () => {
        const out = explainSql("SELECT * FROM ds_1 LIMIT 10");
        expect(out).toMatch(/all columns/);
        expect(out).toMatch(/ds_1/);
        expect(out).toMatch(/10 rows/);
    });

    it("handles GROUP BY + ORDER BY DESC", () => {
        const out = explainSql("SELECT city, SUM(sales) AS total FROM ds_1 GROUP BY city ORDER BY total DESC LIMIT 5");
        expect(out).toMatch(/"city"/);
        expect(out).toMatch(/SUM of "sales"/);
        expect(out).toMatch(/aliased "total"/);
        expect(out).toMatch(/grouped by "city"/);
        expect(out).toMatch(/ordered by "total" DESC/);
    });

    it("handles DATE_TRUNC and WHERE", () => {
        const out = explainSql(
            "SELECT DATE_TRUNC('month', order_date) AS month, SUM(sales) FROM ds_1 WHERE customer_segment ILIKE '%online%' GROUP BY month ORDER BY month ASC"
        );
        expect(out).toMatch(/DATE_TRUNC/);
        expect(out).toMatch(/ILIKE/);
        expect(out).toMatch(/grouped by "month"/);
    });

    it("returns fallback string on unparseable SQL", () => {
        expect(explainSql("NOT VALID SQL")).toMatch(/could not parse/);
    });

    it("handles empty input", () => {
        expect(explainSql("")).toMatch(/empty/);
        expect(explainSql("   ")).toMatch(/empty/);
    });
});
