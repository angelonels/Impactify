require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const prisma = require("../config/db");

if (!process.env.GEMINI_API_KEY) {
    console.warn("[aiService] GEMINI_API_KEY missing — analyze requests will fail until set.");
}

const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    : null;

const MAX_HISTORY_FOR_PROMPT = 6;

// Try the smartest model first; on quota exhaustion fall back to lighter ones.
// Each has its own daily free-tier counter, so when 2.5-flash is exhausted we
// can still serve via 2.5-flash-lite or 2.0-flash.
const MODEL_FALLBACK_CHAIN = (process.env.GEMINI_MODELS
    ? process.env.GEMINI_MODELS.split(",").map((s) => s.trim()).filter(Boolean)
    : ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash"]);

const isQuotaError = (err) => {
    if (!err) return false;
    const msg = (err.message || "").toLowerCase();
    const status = err.status || err.code;
    return (
        status === 429 ||
        status === "RESOURCE_EXHAUSTED" ||
        msg.includes("quota") ||
        msg.includes("rate") ||
        msg.includes("resource_exhausted") ||
        msg.includes("429")
    );
};

/**
 * Call Gemini's generateContent with a model-fallback chain.
 * On quota / rate-limit errors, immediately tries the next model in the chain.
 * Throws the LAST error if every model fails.
 *
 * @param {object} request — the request body sans `model`.
 * @returns {Promise<{response: any, modelUsed: string}>}
 */
async function generateWithFallback(request) {
    let lastErr;
    for (const model of MODEL_FALLBACK_CHAIN) {
        try {
            const response = await ai.models.generateContent({ ...request, model });
            if (model !== MODEL_FALLBACK_CHAIN[0]) {
                console.warn(`[aiService] Served via fallback model "${model}".`);
            }
            return { response, modelUsed: model };
        } catch (err) {
            lastErr = err;
            if (isQuotaError(err)) {
                console.warn(`[aiService] Quota hit on "${model}" — trying next in chain.`);
                continue;
            }
            // Non-quota error: don't burn budget on other models, bail now.
            throw err;
        }
    }
    if (lastErr && isQuotaError(lastErr)) {
        const e = new Error("All Gemini models exhausted their quotas. Try again later or upgrade billing tier.");
        e.statusCode = 429;
        e.cause = lastErr;
        throw e;
    }
    throw lastErr;
}

function renderHistoryBlock(history) {
    if (!Array.isArray(history) || history.length === 0) return "";
    const turns = history.slice(-MAX_HISTORY_FOR_PROMPT).map((m, i) => {
        if (m.role === "user") {
            return `[turn ${i + 1}] USER ASKED: "${m.content}"`;
        }
        const sqlPart = m.sql ? `\nSQL: ${m.sql}` : "";
        const chartPart = m.chartType ? `\nchartType: ${m.chartType}` : "";
        return `[turn ${i + 1}] ASSISTANT REPLIED: "${m.content}"${sqlPart}${chartPart}`;
    });
    return `\nPREVIOUS CONVERSATION (oldest first):\n${turns.join("\n\n")}\n\nWhen the new question contains references like "now break that down by X", "do the same for Y", "instead of A use B", interpret them against the most recent assistant SQL above. Otherwise treat the new question as standalone.\n`;
}

/**
 * Generate SQL + chart config for a NL prompt.
 *
 * @param {string} datasetId
 * @param {string} userPrompt
 * @param {object} [opts]
 * @param {Array<{role, content, sql?, chartType?}>} [opts.history] Prior turns in this conversation.
 * @returns {Promise<{sql: string, chartType: string, overview: string}>}
 */
exports.generateQuery = async (datasetId, userPrompt, opts = {}) => {
    if (!ai) {
        const err = new Error("AI service unavailable: GEMINI_API_KEY is not configured on the server.");
        err.statusCode = 503;
        throw err;
    }

    const dataset = await prisma.dataset.findUnique({
        where: { id: datasetId },
        include: { schema: true },
    });

    if (!dataset) {
        const err = new Error("Dataset not found");
        err.statusCode = 404;
        throw err;
    }

    const schemaContext = dataset.schema
        .map((col) => {
            const desc = col.description ? ` — ${col.description}` : "";
            return `- "${col.columnName}" (${col.dataType})${desc}`;
        })
        .join("\n");

    const historyBlock = renderHistoryBlock(opts.history);

    const prompt = `
        DATABASE SCHEMA:
        ${schemaContext}
        ${historyBlock}
        USER QUESTION:
        "${userPrompt}"

        Generate the JSON response now.
    `;

    try {
        const { response } = await generateWithFallback({
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
            ],
            config: {
                systemInstruction: `
                    You are Impactify, an elite Senior Data Analyst known for precise SQL and insightful visualization choices.

                    Your Mission:
                    Convert natural language questions into executable PostgreSQL queries for a specific dataset, using the PREVIOUS CONVERSATION context when present to resolve follow-up questions naturally.

                    The Table Name is: "${dataset.tableName}"

                    LANGUAGE:
                    The user's question may be in English, Hindi (or transliterated Hinglish), or another language. ALWAYS write SQL keywords and column identifiers in English. Write the "overview" field in the same language as the user's question.

                    STRICT SQL RULES:
                    1. **Read-Only:** Use SELECT statements only. Never use DELETE, DROP, UPDATE, or INSERT.
                    2. **Fuzzy Matching:** When filtering text columns, ALWAYS use 'ILIKE' with wildcards (e.g., column ILIKE '%value%') to handle case sensitivity and partial matches.
                    3. **Aggregation:** If the user asks for "total", "average", or "count", you MUST aggregate the data using GROUP BY.
                    4. **Dates for line charts:** When chartType is 'line' and an x-axis column is a TIMESTAMP, return the raw timestamp (truncated with DATE_TRUNC if grouping by month/week) as a TIMESTAMP — DO NOT use TO_CHAR. Always include 'ORDER BY <date_col> ASC'.
                    5. **Dates for bar/pie:** TO_CHAR(date_col, 'Mon YYYY') is OK when categorizing.
                    6. **Limit:** For 'bar' or 'pie' charts involving categories, LIMIT the results to the top 10-15 rows unless the user specifies otherwise.
                    7. **Follow-ups:** When the user says "now break that down by X" or "do that for Y", reuse filters/aggregations from the most recent assistant SQL and only modify what changed.

                    VISUALIZATION RULES — pick the BEST chartType from this catalog:
                      Comparison / Categorical:
                        • 'bar'       — 1 category + 1 metric (e.g. sales by city). Default for categorical comparison.
                        • 'radial-bar'— circular bar for compact comparison.
                        • 'marimekko' — variable-width stacked bars when proportions + categories matter.
                        • 'radar'     — 1 category + ≥3 numeric metrics (multi-attribute comparison).
                        • 'funnel'    — ordered conversion stages (e.g. signup → activation → purchase).
                        • 'heatmap'   — 2 categorical dimensions + 1 metric (e.g. sales by city × month).
                      Time / Trend:
                        • 'line'      — 1 time/date column + 1+ numeric. Use raw TIMESTAMP (no TO_CHAR), ORDER BY date ASC.
                        • 'area'      — line variant when emphasizing volume.
                        • 'stream'    — stacked smoothed area across ≥2 numeric series over time.
                        • 'bump'      — rank-over-time (e.g. top 5 cities each month).
                        • 'calendar'  — daily heatmap (date + value per day, ideally a year+).
                      Part-to-whole:
                        • 'pie'       — ≤7 slices, percentage question.
                        • 'donut'     — visual variant of pie.
                        • 'treemap'   — many categories, nested rectangles.
                        • 'sunburst'  — hierarchical proportions in a ring.
                        • 'circle-packing' — bubble hierarchy.
                        • 'waffle'    — 10×10 grid for % composition with ≤6 categories.
                      Distribution / Statistical:
                        • 'scatter'   — 2 numeric columns; correlation.
                        • 'boxplot'   — 1 categorical + 1 numeric; quartile distribution per group.
                        • 'swarmplot' — 1 categorical + 1 numeric; raw distribution of points.
                      Single value:
                        • 'kpi'       — single aggregate value answer ("what's total sales").
                      Tabular:
                        • 'table'     — raw lists, details, or when no chart fits.

                    OUTPUT FORMAT:
                    Return ONLY a raw JSON object with these keys:
                    - "sql": The executable PostgreSQL query.
                    - "chartType": One of the chart codes listed above.
                    - "overview": A brief, witty, helpful explanation of the info in the chart. If this answers a follow-up, briefly mention what changed from the previous turn.
                `,
                responseMimeType: "application/json",
                temperature: 0,
            },
        });

        const responseText = response.text;

        let parsedResult;
        try {
            parsedResult = JSON.parse(responseText);
        } catch (parseErr) {
            const err = new Error("AI returned malformed JSON.");
            err.statusCode = 502;
            err.cause = parseErr;
            throw err;
        }

        if (!parsedResult || typeof parsedResult.sql !== "string") {
            const err = new Error("AI response missing required 'sql' field.");
            err.statusCode = 502;
            throw err;
        }

        return parsedResult;
    } catch (error) {
        console.error("[aiService.generateQuery]", error);
        if (!error.statusCode) error.statusCode = 502;
        throw error;
    }
};

/**
 * Re-prompt Gemini after a SQL execution failure. Sends original prompt,
 * the failing SQL, and the Postgres error message; asks for a corrected query.
 */
exports.repairQuery = async (datasetId, userPrompt, failedSql, pgErrorMessage, opts = {}) => {
    if (!ai) {
        const err = new Error("AI service unavailable: GEMINI_API_KEY is not configured on the server.");
        err.statusCode = 503;
        throw err;
    }

    const dataset = await prisma.dataset.findUnique({
        where: { id: datasetId },
        include: { schema: true },
    });
    if (!dataset) {
        const err = new Error("Dataset not found");
        err.statusCode = 404;
        throw err;
    }

    const schemaContext = dataset.schema
        .map((col) => `- "${col.columnName}" (${col.dataType})`)
        .join("\n");

    const historyBlock = renderHistoryBlock(opts.history);

    const prompt = `
        DATABASE SCHEMA:
        ${schemaContext}
        ${historyBlock}
        USER QUESTION:
        "${userPrompt}"

        Your previous SQL attempt failed:
        --- FAILED SQL ---
        ${failedSql}
        --- POSTGRES ERROR ---
        ${pgErrorMessage}
        --- END ---

        Produce a corrected JSON response. Fix the SQL while keeping the original intent. If the column referenced doesn't exist, pick the nearest valid one from the schema. Return the SAME JSON shape as before.
    `;

    const { response } = await generateWithFallback({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
            systemInstruction: `You are repairing a previously-failed PostgreSQL query for the table "${dataset.tableName}". Return ONLY a raw JSON object with keys "sql", "chartType", "overview". Read-only SELECT statements only.`,
            responseMimeType: "application/json",
            temperature: 0,
        },
    });

    const responseText = response.text;
    try {
        const parsed = JSON.parse(responseText);
        if (typeof parsed.sql !== "string") throw new Error("missing sql");
        return parsed;
    } catch (parseErr) {
        const err = new Error("AI repair returned malformed JSON.");
        err.statusCode = 502;
        throw err;
    }
};

exports.renderHistoryBlock = renderHistoryBlock;
