import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface AnalyticsDay {
  label: string;
  approved: number;
}

interface AnalyticsValue {
  name: string;
  value: number;
  color?: string;
}

interface GardenAnalyticsChartsProps {
  period: 7 | 30 | 90;
  onPeriodChange: (period: 7 | 30 | 90) => void;
  dateBuckets: AnalyticsDay[];
  taskStatusData: AnalyticsValue[];
  tasksByType: AnalyticsValue[];
  tasksLoading: boolean;
  tasksError: boolean;
}

export default function GardenAnalyticsCharts({
  period,
  onPeriodChange,
  dateBuckets,
  taskStatusData,
  tasksByType,
  tasksLoading,
  tasksError,
}: GardenAnalyticsChartsProps) {
  const cardClass = 'min-w-0 rounded-[14px] border border-gray-200 bg-white p-4 sm:p-5';
  const compactChartHeight = 'h-[170px] sm:h-[185px] lg:h-auto lg:min-h-[110px] lg:flex-1';
  const axisTick = { fill: '#526056', fontSize: 10 };
  const tooltipStyle = { borderRadius: 10, border: '1px solid #e5e7eb', boxShadow: '0 8px 22px rgba(20, 40, 25, .08)', fontSize: 12 };
  const approvedTotal = dateBuckets.reduce((total, day) => total + day.approved, 0);
  const taskStatusTotal = taskStatusData.reduce((total, item) => total + item.value, 0);
  const maxDailyTasks = Math.max(0, ...dateBuckets.map((day) => day.approved));
  const sortedTasksByType = [...tasksByType].sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, 'pt-BR'));
  const maxTasksByType = Math.max(0, ...sortedTasksByType.map((item) => item.value));
  const dateLabelInterval = period === 7 ? 0 : period === 30 ? 4 : 11;

  return <section className="min-w-0 rounded-[14px] border border-gray-200 bg-gray-50/70 p-4 sm:p-5 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col" aria-label="Análise da horta">
    <div className="mb-4 flex flex-col justify-between gap-3 sm:mb-5 sm:flex-row sm:items-center">
      <h2 className="text-[16px] font-semibold text-neutral-950">Acompanhamento da horta</h2>
      <PeriodSelector period={period} onChange={onPeriodChange} />
    </div>

    <div className="grid min-w-0 gap-3 sm:gap-4 md:grid-cols-2 lg:min-h-0 lg:flex-1 lg:grid-rows-2 lg:auto-rows-fr">
      <article className={`${cardClass} min-h-[220px] lg:flex lg:min-h-0 lg:flex-col`} aria-labelledby="task-summary-title">
        <h3 id="task-summary-title" className="text-[13px] font-semibold text-neutral-950">Resumo das tarefas</h3>
        {tasksLoading ? <ChartLoading className="flex-1" /> : tasksError ? <ChartEmpty message="Não foi possível carregar as tarefas" /> : taskStatusTotal === 0 ? <ChartEmpty message="Ainda não há tarefas para resumir" /> :
          <div className="mt-2 flex min-h-0 flex-1 items-center gap-3 sm:gap-5">
            <div className="relative size-[92px] shrink-0 sm:size-[104px]" role="img" aria-label={`Resumo de ${taskStatusTotal} tarefas por situação`}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskStatusData.filter((item) => item.value > 0)} dataKey="value" nameKey="name" innerRadius="66%" outerRadius="94%" paddingAngle={2} stroke="#fff" strokeWidth={2}>
                    {taskStatusData.filter((item) => item.value > 0).map((item) => <Cell key={item.name} fill={item.color || '#16a34a'} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
                <span className="text-[20px] font-bold leading-none text-neutral-950">{taskStatusTotal}</span>
                <span className="mt-1 text-[10px] text-[#718075]">tarefas</span>
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-2.5" aria-label="Tarefas por situação">
              {taskStatusData.map((item) => <li key={item.name} className="flex min-w-0 items-center gap-2 text-[11px] sm:text-[12px]">
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color || '#16a34a' }} aria-hidden="true" />
                <span className="min-w-0 flex-1 text-[#526056]">{item.name}</span>
                <span className="shrink-0 font-semibold tabular-nums text-neutral-950">{item.value}</span>
              </li>)}
            </ul>
          </div>}
      </article>

      <article className={`${cardClass} min-h-[220px] lg:flex lg:min-h-0 lg:flex-col`} aria-labelledby="activity-chart-title">
        <h3 id="activity-chart-title" className="text-[13px] font-semibold text-neutral-950">Evolução das atividades</h3>
        {tasksLoading ? <ChartLoading className={compactChartHeight} /> : tasksError ? <ChartEmpty className={compactChartHeight} message="Não foi possível carregar as tarefas" /> : approvedTotal === 0 ? <ChartEmpty className={compactChartHeight} message="Sem tarefas aprovadas neste período" /> :
          <div className={`mt-2 w-full min-w-0 ${compactChartHeight}`} role="img" aria-label={`Tarefas aprovadas por dia nos últimos ${period} dias`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dateBuckets} margin={{ top: 8, right: 4, bottom: 0, left: -18 }} barCategoryGap={period === 7 ? '32%' : period === 30 ? '28%' : '12%'}>
                <CartesianGrid vertical={false} stroke="#edf1ed" />
                <XAxis dataKey="label" interval={dateLabelInterval} tick={axisTick} tickLine={false} axisLine={false} minTickGap={8} tickMargin={7} height={25} />
                <YAxis allowDecimals={false} domain={[0, maxDailyTasks]} ticks={integerTicks(maxDailyTasks)} tick={axisTick} tickLine={false} axisLine={false} width={28} tickMargin={4} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value, 'Tarefas aprovadas']} labelStyle={{ color: '#26362a', fontWeight: 600 }} />
                <Bar dataKey="approved" name="Tarefas aprovadas" fill="#16a34a" radius={[3, 3, 0, 0]} maxBarSize={period === 7 ? 20 : 12} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>}
      </article>

      <article className={`${cardClass} min-h-[220px] lg:flex lg:min-h-0 lg:flex-col`} aria-labelledby="task-type-title">
        <h3 id="task-type-title" className="text-[13px] font-semibold text-neutral-950">Tarefas por tipo</h3>
        {tasksLoading ? <ChartLoading className="flex-1" /> : tasksError ? <ChartEmpty message="Não foi possível carregar as tarefas" /> : sortedTasksByType.length === 0 ? <ChartEmpty message="Sem tarefas aprovadas neste período" /> :
          <ul className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto" aria-label="Quantidade de tarefas aprovadas por categoria">
            {sortedTasksByType.map((item) => <li key={item.name} className="grid grid-cols-[minmax(0,1fr)_2rem] items-center gap-x-3 gap-y-1.5 text-[11px] sm:text-[12px]">
              <span className="min-w-0 truncate text-[#526056]" title={item.name}>{item.name}</span>
              <span className="text-right font-semibold tabular-nums text-neutral-950">{item.value}</span>
              <span className="col-span-2 h-2 overflow-hidden rounded-full bg-gray-100" aria-hidden="true"><span className="block h-full rounded-full bg-[#16a34a]" style={{ width: `${maxTasksByType ? item.value / maxTasksByType * 100 : 0}%` }} /></span>
            </li>)}
          </ul>}
      </article>
    </div>
  </section>;
}

function integerTicks(maximum: number): number[] {
  if (maximum <= 5) return Array.from({ length: maximum + 1 }, (_, index) => index);
  const step = Math.ceil(maximum / 4);
  const ticks = [0];
  for (let value = step; value < maximum; value += step) ticks.push(value);
  if (ticks[ticks.length - 1] !== maximum) ticks.push(maximum);
  return ticks;
}

function PeriodSelector({ period, onChange }: { period: 7 | 30 | 90; onChange: (period: 7 | 30 | 90) => void }) {
  return <div className="inline-flex w-fit rounded-xl border border-gray-200 bg-white p-1" role="group" aria-label="Filtrar gráficos por período">
    {([7, 30, 90] as const).map((days) => <button key={days} type="button" onClick={() => onChange(days)} aria-pressed={period === days} className={`min-w-[58px] rounded-lg px-3 py-2 text-[11px] font-semibold transition-colors ${period === days ? 'bg-[#00a63e] text-white shadow-sm' : 'text-[#647067] hover:bg-gray-50'}`}>{days} dias</button>)}
  </div>;
}

function ChartEmpty({ className = 'min-h-[132px] flex-1', message }: { className?: string; message: string }) {
  return <div className={`mt-2 flex w-full items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/70 px-4 text-center ${className}`}>
    <p className="max-w-[240px] text-[12px] leading-relaxed text-[#849087]">{message}</p>
  </div>;
}

function ChartLoading({ className }: { className: string }) {
  return <div className={`mt-2 w-full animate-pulse rounded-xl bg-gray-100 ${className}`} aria-label="Carregando gráfico" />;
}
