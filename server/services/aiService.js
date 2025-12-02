require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");
const prisma = require('../config/db');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.generateQuery = async (datasetId, userPrompt) => {

    console.log(`Start`);
    console.log(`id:${datasetId}`);
    console.log(`Prompt:${userPrompt}"`);

    const dataset = await prisma.dataset.findUnique({ 
        where: { id: datasetId },
        include: { schema: true }
    });

    if (!dataset) {
        console.error("Dataset not found in database");
        throw new Error("Dataset not found");
    }
    
// Schema so that AI can have some reference while generating SQL
    const schemaContext = dataset.schema.map(col => 
        `- "${col.columnName}" (${col.dataType})`
    ).join('\n');

    const prompt = `
        DATABASE SCHEMA:
        ${schemaContext}

        USER QUESTION: 
        "${userPrompt}"

        Generate the JSON response now.
    `;
    

    try {

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ],
            config: {
                systemInstruction: `
                    You are Impactify, an elite Senior Data Analyst known for precise SQL and insightful visualization choices.
                    
                    Your Mission:
                    Convert natural language questions into executable PostgreSQL queries for a specific dataset.

                    The Table Name is: "${dataset.tableName}"

                    STRICT SQL RULES:
                    1. **Read-Only:** Use SELECT statements only. Never use DELETE, DROP, UPDATE, or INSERT.
                    2. **Fuzzy Matching:** When filtering text columns, ALWAYS use 'ILIKE' with wildcards (e.g., column ILIKE '%value%') to handle case sensitivity and partial matches.
                    3. **Aggregation:** If the user asks for "total", "average", or "count", you MUST aggregate the data using GROUP BY.
                    4. **Dates:** If grouping by date (Year/Month), use PostgreSQL's TO_CHAR(date_col, 'Mon YYYY') or EXTRACT functions.
                    5. **Limit:** For 'bar' or 'pie' charts involving categories, LIMIT the results to the top 10-15 rows to prevent overcrowded visualizations unless the user specifies otherwise.
                    
                    VISUALIZATION RULES:
                    - **'line'**: Use ONLY if there is a time/date column on the X-axis.
                    - **'bar'**: Use for comparing categories (e.g., Sales by City).
                    - **'pie'**: Use ONLY for part-to-whole comparisons (e.g., % of Market Share) with few categories (max 5-7).
                    - **'table'**: Use if the user asks for raw lists, details, or if the data doesn't fit a chart.
                    
                    OUTPUT FORMAT:
                    Return ONLY a raw JSON object with these keys:
                    - "sql": The executable PostgreSQL query.
                    - "chartType": One of ['bar', 'line', 'pie', 'table'].
                    - "overview": A brief, witty, and helpful explanation of the info in the chart.
                `,
                responseMimeType: "application/json",
                temperature: 0 
            }
        });

        console.log("Response received");
        
        const responseText = response.text; 

        const parsedResult = JSON.parse(responseText);
        
        return parsedResult;

    } catch (error) {
        console.error(error);

        return {
            sql: `SELECT * FROM ${dataset.tableName} LIMIT 10`,
            chartType: "table",
            overview: "I had a bit of a brain freeze processing that query. Here is a preview of your data instead!"
        };
    }
};