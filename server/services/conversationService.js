const prisma = require("../config/db");

const MAX_TITLE_WORDS = 8;
const MAX_TITLE_CHARS = 60;
const HISTORY_LIMIT = 6;

/**
 * Build a short, human-readable title from the user's first prompt.
 */
function titleFromPrompt(prompt) {
    const trimmed = String(prompt || "").trim().replace(/\s+/g, " ");
    if (!trimmed) return "Untitled conversation";
    const words = trimmed.split(" ").slice(0, MAX_TITLE_WORDS).join(" ");
    return words.length > MAX_TITLE_CHARS ? words.slice(0, MAX_TITLE_CHARS - 1) + "…" : words;
}

async function assertDatasetOwned(datasetId, userId) {
    const dataset = await prisma.dataset.findUnique({ where: { id: datasetId } });
    if (!dataset) {
        const err = new Error("Dataset not found");
        err.statusCode = 404;
        throw err;
    }
    if (dataset.userId !== userId) {
        const err = new Error("You do not have access to this dataset.");
        err.statusCode = 403;
        throw err;
    }
    return dataset;
}

async function createConversation({ userId, datasetId, firstPrompt }) {
    await assertDatasetOwned(datasetId, userId);
    return prisma.conversation.create({
        data: {
            userId,
            datasetId,
            title: titleFromPrompt(firstPrompt),
        },
    });
}

async function getConversation({ conversationId, userId }) {
    const conv = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
            messages: { orderBy: { createdAt: "asc" } },
        },
    });
    if (!conv) {
        const err = new Error("Conversation not found");
        err.statusCode = 404;
        throw err;
    }
    if (conv.userId !== userId) {
        const err = new Error("You do not have access to this conversation.");
        err.statusCode = 403;
        throw err;
    }
    return conv;
}

async function listConversations({ userId, datasetId }) {
    return prisma.conversation.findMany({
        where: { userId, ...(datasetId ? { datasetId } : {}) },
        orderBy: { updatedAt: "desc" },
        select: {
            id: true,
            title: true,
            datasetId: true,
            createdAt: true,
            updatedAt: true,
            _count: { select: { messages: true } },
        },
    });
}

async function renameConversation({ conversationId, userId, title }) {
    await getConversation({ conversationId, userId });
    return prisma.conversation.update({
        where: { id: conversationId },
        data: { title: titleFromPrompt(title) },
    });
}

async function deleteConversation({ conversationId, userId }) {
    await getConversation({ conversationId, userId });
    await prisma.conversation.delete({ where: { id: conversationId } });
}

async function appendMessage(conversationId, message) {
    const msg = await prisma.message.create({
        data: { conversationId, ...message },
    });
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
    });
    return msg;
}

/**
 * Pull the last N messages of a conversation, oldest first, formatted
 * for direct injection into the LLM prompt.
 */
async function getHistoryForLLM(conversationId, limit = HISTORY_LIMIT) {
    const recent = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
        take: limit,
    });
    return recent.reverse().map((m) => ({
        role: m.role,
        content: m.content,
        sql: m.sql,
        chartType: m.chartType,
    }));
}

module.exports = {
    titleFromPrompt,
    createConversation,
    getConversation,
    listConversations,
    renameConversation,
    deleteConversation,
    appendMessage,
    getHistoryForLLM,
    HISTORY_LIMIT,
};
