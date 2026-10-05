const test = require('node:test');
const assert = require('node:assert/strict');
const { getAchievementProgress, getActiveStreak, getLevelInfo, getNextStreak } = require('./gamification');

test('níveis avançam a cada 500 XP e o XP nunca fica negativo', () => {
    assert.deepEqual(getLevelInfo(-20), {
        level: 1, level_name: 'Semente', xp: 0, xp_to_next_level: 500, total_xp: 0, is_max_level: false,
    });
    assert.equal(getLevelInfo(500).level_name, 'Broto');
    assert.equal(getLevelInfo(1250).xp, 250);
    assert.equal(getLevelInfo(2500).level_name, 'Guardião');
    assert.equal(getLevelInfo(4000).xp, 500);
    assert.equal(getLevelInfo(4000).is_max_level, true);
});

test('sequência continua no mesmo dia, soma no dia seguinte e reinicia após uma pausa', () => {
    assert.equal(getNextStreak(3, '2026-10-05', '2026-10-05'), 3);
    assert.equal(getNextStreak(3, '2026-10-04', '2026-10-05'), 4);
    assert.equal(getNextStreak(3, '2026-10-02', '2026-10-05'), 1);
    assert.equal(getActiveStreak(4, '2026-10-03', '2026-10-05'), 0);
});

test('conquistas dependem de tarefas reais, sequência e tarefas na mesma horta', () => {
    const tasks = Array.from({ length: 20 }, (_, index) => ({ id_horta: index < 19 ? 7 : 8 }));
    assert.deepEqual(getAchievementProgress(tasks, 4), {
        'first-task': true, 'ten-tasks': true, 'five-day-streak': false, 'garden-guardian': false,
    });
    tasks.push({ id_horta: 7 });
    assert.equal(getAchievementProgress(tasks, 5)['garden-guardian'], true);
    assert.equal(getAchievementProgress([], 5)['first-task'], false);
});
