const test = require('node:test');
const assert = require('node:assert/strict');
const {
    GEMINI_MODEL,
    parseAnalysisResponse,
    requestGeminiAnalysis,
    shouldAutoApprove,
} = require('./gemini');

function geminiResponse(result, confidence = 0.95) {
    return {
        status: 'completed',
        steps: [{ type: 'model_output', content: [{
            type: 'text',
            text: JSON.stringify({ resultado: result, confianca: confidence, justificativa: 'Evidência visual suficiente.' }),
        }] }],
    };
}

test('parseia e valida a saída estruturada do Gemini', () => {
    assert.deepEqual(parseAnalysisResponse(geminiResponse('COMPATIVEL', 0.95)), {
        resultado: 'COMPATIVEL', confianca: 0.95, justificativa: 'Evidência visual suficiente.',
    });
    assert.throws(() => parseAnalysisResponse({ output_text: '{inválido' }));
    assert.throws(() => parseAnalysisResponse({ output_text: JSON.stringify({ resultado: 'SIM', confianca: 0.9, justificativa: 'x' }) }));
    assert.throws(() => parseAnalysisResponse({ output_text: JSON.stringify({ resultado: 'COMPATIVEL', confianca: 1.1, justificativa: 'x' }) }));
});

test('chama Interactions com modelo, tarefa, imagem já persistida e chave apenas em header', async () => {
    let request;
    const result = await requestGeminiAnalysis({
        taskTitle: 'Preparar composto', image: Buffer.from('jpeg bytes'), mimeType: 'image/jpeg', apiKey: 'server-secret',
        fetchImpl: async (url, options) => {
            request = { url, options };
            return new Response(JSON.stringify(geminiResponse('COMPATIVEL')), { status: 200 });
        },
    });
    assert.equal(result.resultado, 'COMPATIVEL');
    assert.equal(request.url, 'https://generativelanguage.googleapis.com/v1beta/interactions');
    assert.equal(request.options.headers['x-goog-api-key'], 'server-secret');
    const payload = JSON.parse(request.options.body);
    assert.equal(payload.model, GEMINI_MODEL);
    assert.match(payload.input[0].text, /Preparar composto/);
    assert.equal(payload.input[1].data, Buffer.from('jpeg bytes').toString('base64'));
    assert.equal(payload.input[1].mime_type, 'image/jpeg');
    assert.equal(payload.store, false);
});

test('retry curto em 503 e encaminha erro/JSON inválido para indisponibilidade', async () => {
    let calls = 0;
    const result = await requestGeminiAnalysis({
        taskTitle: 'Tarefa', image: Buffer.from('data'), mimeType: 'image/webp', apiKey: 'test',
        fetchImpl: async () => ++calls === 1
            ? new Response('', { status: 503 })
            : new Response(JSON.stringify(geminiResponse('INCONCLUSIVO', 0.5)), { status: 200 }),
    });
    assert.equal(calls, 2);
    assert.equal(result.resultado, 'INCONCLUSIVO');
    await assert.rejects(requestGeminiAnalysis({
        taskTitle: 'Tarefa', image: Buffer.from('data'), mimeType: 'image/jpeg', apiKey: 'test',
        fetchImpl: async () => new Response('', { status: 503 }),
    }), /HTTP 503/);
    await assert.rejects(requestGeminiAnalysis({
        taskTitle: 'Tarefa', image: Buffer.from('data'), mimeType: 'image/jpeg', apiKey: 'test',
        fetchImpl: async () => new Response(JSON.stringify({ status: 'completed', output_text: 'não é JSON' }), { status: 200 }),
    }), /JSON/);
});

test('autoaprova apenas COMPATIVEL com confiança mínima e GPS validado', () => {
    assert.equal(shouldAutoApprove({ resultado: 'COMPATIVEL', confianca: 0.95 }, 'validated'), true);
    assert.equal(shouldAutoApprove({ resultado: 'COMPATIVEL', confianca: 0.84 }, 'validated'), false);
    assert.equal(shouldAutoApprove({ resultado: 'INCONCLUSIVO', confianca: 0.99 }, 'validated'), false);
    assert.equal(shouldAutoApprove({ resultado: 'INCOMPATIVEL', confianca: 0.99 }, 'validated'), false);
    assert.equal(shouldAutoApprove({ resultado: 'COMPATIVEL', confianca: 0.99 }, 'outside_radius'), false);
    assert.equal(shouldAutoApprove({ resultado: 'COMPATIVEL', confianca: 0.99 }, 'unavailable'), false);
});
