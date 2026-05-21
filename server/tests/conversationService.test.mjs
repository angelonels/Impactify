import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { titleFromPrompt } = require("../services/conversationService");

describe("conversationService.titleFromPrompt", () => {
    it("trims and joins first 8 words", () => {
        expect(titleFromPrompt("show me the monthly total sales of all products please")).toBe(
            "show me the monthly total sales of all"
        );
    });

    it("handles empty / whitespace", () => {
        expect(titleFromPrompt("")).toBe("Untitled conversation");
        expect(titleFromPrompt("   ")).toBe("Untitled conversation");
        expect(titleFromPrompt(null)).toBe("Untitled conversation");
    });

    it("collapses multiple spaces", () => {
        expect(titleFromPrompt("foo    bar   baz")).toBe("foo bar baz");
    });

    it("truncates with ellipsis if over 60 chars", () => {
        const long = Array(20).fill("verylongword").join(" ");
        const t = titleFromPrompt(long);
        expect(t.length).toBeLessThanOrEqual(60);
    });

    it("short prompt returned verbatim", () => {
        expect(titleFromPrompt("hi")).toBe("hi");
    });
});
