const GEMINI_MODEL = 'gemini-3.6-flash';
const GEMINI_INTERACTIONS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';

const RESULTADOS = new Set(['COMPATIVEL', 'INCONCLUSIVO', 'INCOMPATIVEL']);

function extractOutputText(interaction) {
    if (typeof interaction?.output_text === 'string') return interaction.output_text;
    const output = [];
    for (const step of interaction?.steps || []) {
        if (step.type !== 'model_output') continue;
        for (const content of step.content || []) {
            if (content.type === 'text' && typeof content.text === 'string') output.push(content.text);
        }
    }
    return output.join('\n').trim();
}

function parseAnalysisResponse(interaction) {
    const outputText = extractOutputText(interaction);
    if (!outputText) throw new Error('Gemini não retornou uma análise textual');
    const parsed = JSON.parse(outputText);
    if (!parsed || !RESULTADOS.has(parsed.resultado)) throw new Error('Resultado da análise Gemini inválido');
    const confidence = Number(parsed.confianca);
    if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) throw new Error('Confiança da análise Gemini inválida');
    if (typeof parsed.justificativa !== 'string' || !parsed.justificativa.trim()) throw new Error('Justificativa da análise Gemini ausente');
    return {
        resultado: parsed.resultado,
        confianca: confidence,
        justificativa: parsed.justificativa.trim().slice(0, 512),
    };
}

async function requestGeminiAnalysis({ taskTitle, image, mimeType, apiKey = process.env.GEMINI_API_KEY, fetchImpl = fetch, timeoutMs = 12000, endpoint = process.env.GEMINI_INTERACTIONS_URL || GEMINI_INTERACTIONS_URL }) {
    if (!apiKey) throw new Error('GEMINI_API_KEY não configurada no backend');
    if (!Buffer.isBuffer(image) || image.length === 0) throw new Error('Imagem de comprovação ausente');
    if (!['image/jpeg', 'image/webp'].includes(mimeType)) throw new Error('Formato de imagem de comprovação inválido');

    const prompt = `Analise a foto enviada como comprovação da tarefa "${String(taskTitle || '').slice(0, 256)}". Determine apenas se a imagem mostra evidência visual compatível com a tarefa. Não suponha ações que não aparecem na foto. Se a foto for ambígua, ruim ou insuficiente, use INCONCLUSIVO. Responda somente o JSON exigido, com confiança numérica entre 0 e 1 e justificativa curta em português.`;
    const payload = {
        model: GEMINI_MODEL,
        input: [
            { type: 'text', text: prompt },
            { type: 'image', mime_type: mimeType, data: image.toString('base64') },
        ],
        response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: {
                type: 'object',
                properties: {
                    resultado: { type: 'string', enum: [...RESULTADOS] },
                    confianca: { type: 'number', minimum: 0, maximum: 1 },
                    justificativa: { type: 'string' },
                },
                required: ['resultado', 'confianca', 'justificativa'],
                additionalProperties: false,
            },
        },
        generation_config: { thinking_level: 'minimal', max_output_tokens: 256 },
        store: false,
    };

    for (let attempt = 0; attempt < 2; attempt += 1) {
        let response;
        try {
            response = await fetchImpl(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(timeoutMs),
            });
        } catch (error) {
            throw error;
        }
        if (response.status === 503 && attempt === 0) {
            await new Promise((resolve) => setTimeout(resolve, 250));
            continue;
        }
        if (!response.ok) throw new Error(`Gemini API indisponível (HTTP ${response.status})`);
        const interaction = await response.json();
        if (interaction.status && interaction.status !== 'completed') throw new Error(`Gemini interaction terminou com status ${interaction.status}`);
        return parseAnalysisResponse(interaction);
    }
    throw new Error('Gemini API indisponível após retry');
}

function shouldAutoApprove(analysis, locationStatus) {
    return analysis?.resultado === 'COMPATIVEL'
        && Number(analysis.confianca) >= 0.85
        && locationStatus === 'validated';
}

module.exports = {
    GEMINI_MODEL,
    GEMINI_INTERACTIONS_URL,
    extractOutputText,
    parseAnalysisResponse,
    requestGeminiAnalysis,
    shouldAutoApprove,
};
