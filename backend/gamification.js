const LEVELS = [
    { level: 1, name: 'Semente' },
    { level: 2, name: 'Broto' },
    { level: 3, name: 'Muda' },
    { level: 4, name: 'Cultivador' },
    { level: 5, name: 'Jardineiro' },
    { level: 6, name: 'Guardião' },
];

const XP_PER_LEVEL = 500;

const ACHIEVEMENTS = [
    { id: 'first-task', name: 'Primeira muda', description: 'Conclua sua primeira tarefa', icon: '🌱', xp: 50 },
    { id: 'ten-tasks', name: '10 tarefas', description: 'Conclua 10 tarefas', icon: '🏅', xp: 100 },
    { id: 'five-day-streak', name: '5 dias seguidos', description: 'Conclua tarefas em 5 dias consecutivos', icon: '🔥', xp: 150 },
    { id: 'garden-guardian', name: 'Guardião da horta', description: 'Conclua 20 tarefas em uma mesma horta', icon: '🏡', xp: 200 },
];

function getLevelInfo(totalXp) {
    const safeXp = Math.max(0, Math.floor(Number(totalXp) || 0));
    const level = Math.min(LEVELS.length, Math.floor(safeXp / XP_PER_LEVEL) + 1);
    const isMaxLevel = level === LEVELS.length;
    const xp = isMaxLevel ? XP_PER_LEVEL : safeXp % XP_PER_LEVEL;
    return {
        level,
        level_name: LEVELS[level - 1].name,
        xp,
        xp_to_next_level: XP_PER_LEVEL,
        total_xp: safeXp,
        is_max_level: isMaxLevel,
    };
}

function getNextStreak(currentStreak, lastActivityDate, today) {
    const current = Math.max(0, Math.floor(Number(currentStreak) || 0));
    if (lastActivityDate === today) return current;
    const yesterday = new Date(`${today}T00:00:00.000Z`);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    return lastActivityDate === yesterday.toISOString().slice(0, 10) ? current + 1 : 1;
}

function getActiveStreak(currentStreak, lastActivityDate, today) {
    if (!lastActivityDate) return 0;
    const yesterday = new Date(`${today}T00:00:00.000Z`);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    return lastActivityDate === today || lastActivityDate === yesterday.toISOString().slice(0, 10)
        ? Math.max(0, Number(currentStreak) || 0)
        : 0;
}

function getAchievementProgress(tasks, longestStreak) {
    const byGarden = new Map();
    for (const task of tasks) {
        if (task.id_horta == null) continue;
        const gardenId = Number(task.id_horta);
        byGarden.set(gardenId, (byGarden.get(gardenId) || 0) + 1);
    }
    return {
        'first-task': tasks.length >= 1,
        'ten-tasks': tasks.length >= 10,
        'five-day-streak': longestStreak >= 5,
        'garden-guardian': [...byGarden.values()].some((count) => count >= 20),
    };
}

module.exports = { ACHIEVEMENTS, LEVELS, XP_PER_LEVEL, getAchievementProgress, getActiveStreak, getLevelInfo, getNextStreak };
