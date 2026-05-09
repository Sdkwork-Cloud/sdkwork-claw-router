import { useState, useMemo, useEffect } from 'react';
import { Key, Server, BarChart2, Users, Coins, Database, Zap, Clock, Calendar, RefreshCw, ChevronDown, Activity, Fingerprint, Image, Mic, MessageSquare, ArrowDownRight, ArrowUpRight, TrendingUp, ExternalLink, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts';
import { AdminDashboardService, PieChartData, RecentUsageTrace } from './dashboardService';

type ChartPayloadEntry = {
  color?: string;
  name?: string | number;
  value?: string | number;
  payload?: {
    value?: string | number;
  };
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: ChartPayloadEntry[];
  label?: string | number;
};

type CustomPieLegendProps = {
  payload?: ChartPayloadEntry[];
  unit: '$' | '%';
};

export function DashboardAdmin() {
  const [timeRange, setTimeRange] = useState('今日');
  const [granularity, setGranularity] = useState('按小时');
  const [chartTab, setChartTab] = useState<'模型分布' | '用户消费榜'>('模型分布');
  const [trendMetric, setTrendMetric] = useState<'tokens' | 'cost' | 'requests'>('tokens');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  const [loading, setLoading] = useState(true);
  const [userConsumptionData, setUserConsumptionData] = useState<PieChartData[]>([]);
  const [multimodalData, setMultimodalData] = useState<PieChartData[]>([]);
  const [modelDistribution, setModelDistribution] = useState<PieChartData[]>([]);
  const [recentUsage, setRecentUsage] = useState<RecentUsageTrace[]>([]);
  useEffect(() => {
    AdminDashboardService.fetchDashboardData().then(data => {
      setUserConsumptionData(data.userConsumption);
      setMultimodalData(data.multimodal);
      setModelDistribution(data.modelDistribution);
      setRecentUsage(data.recentUsage);
      setLoading(false);
    });
  }, []);

  const TIME_RANGES = ['今日', '昨日', '本周', '本月', '今年', '近7天', '近30天'];

  const availableGranularities = useMemo(() => {
    switch (timeRange) {
      case '今日':
      case '昨日':
        return ['按分钟', '按小时'];
      case '本周':
      case '近7天':
        return ['按小时', '按天'];
      case '本月':
      case '近30天':
        return ['按天', '按周'];
      case '今年':
        return ['按月', '按季度'];
      default:
        return ['按天'];
    }
  }, [timeRange]);

  useEffect(() => {
    if (!availableGranularities.includes(granularity)) {
      setGranularity(availableGranularities[0]); // fallback to the first valid granularity
    }
  }, [timeRange, availableGranularities, granularity]);

  const activeChartData = useMemo(() => {
    return AdminDashboardService.generateTrafficData(timeRange, granularity);
  }, [timeRange, granularity]);

  const CustomTooltip = ({ active, payload = [], label }: CustomTooltipProps) => {
    if (active && payload.length) {
      return (
        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 p-3 rounded-lg shadow-xl outline-none">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</p>
          <div className="flex flex-col gap-1.5">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color ?? '#64748b' }} />
                <span className="text-slate-600 dark:text-slate-400">
                  {entry.name === 'tokens' ? 'Token 消耗' : entry.name === 'cost' ? '金额消耗' : entry.name === 'requests' ? 'API 请求' : String(entry.name ?? '')}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white ml-auto pl-4">
                  {entry.name === 'cost' ? `$${Number(entry.value ?? 0).toFixed(2)}` : Number(entry.value ?? 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomPieLegend = ({ payload = [], unit }: CustomPieLegendProps) => {
    return (
      <ul className="flex flex-col gap-3">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center justify-between text-xs w-full">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color ?? '#64748b' }} />
              <span className="text-slate-600 dark:text-slate-400 font-medium">{entry.value}</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white ml-4 tracking-tight tabular-nums">
              {unit === '$' ? `$${entry.payload?.value ?? 0}` : `${entry.payload?.value ?? 0}${unit}`}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-slate-500 dark:text-slate-400">加载大盘数据中...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col space-y-4 overflow-y-auto pb-8 custom-scrollbar">

      {/* Top Value Cards (Grid of 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex items-start gap-4 hover:border-slate-300 dark:hover:border-white/20 transition-all hover:-translate-y-1">
          <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400 mt-1">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">API 密钥</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">1</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center"><Activity className="w-3 h-3 mr-1" /> 1 启用</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex items-start gap-4 hover:border-slate-300 dark:hover:border-white/20 transition-all hover:-translate-y-1">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400 mt-1">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">账号池数</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12</h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center"><Activity className="w-3 h-3 mr-1" /> 12 启用</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex items-start gap-4 hover:border-slate-300 dark:hover:border-white/20 transition-all hover:-translate-y-1">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400 mt-1">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">今日请求</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">8,401</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-500 flex items-center font-medium"><TrendingUp className="w-3 h-3 mr-0.5" /> 12.5%</span> 较昨日
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex items-start gap-4 hover:border-slate-300 dark:hover:border-white/20 transition-all hover:-translate-y-1">
          <div className="p-3 bg-teal-50 dark:bg-teal-500/10 rounded-lg text-teal-600 dark:text-teal-400 mt-1">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">总用户数</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">245</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-500 flex items-center font-medium"><TrendingUp className="w-3 h-3 mr-0.5" /> 24</span> 本月新增
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex items-start gap-4 hover:border-slate-300 dark:hover:border-white/20 transition-all hover:-translate-y-1">
          <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400 mt-1">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">今日使用 (Tokens/金额)</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">1.2M</h3>
            <p className="text-xs flex items-center gap-1 mt-1 flex-wrap">
              <span className="text-emerald-500 font-medium">$12.40</span> <span className="opacity-50 dark:text-slate-500">/</span> <span className="text-slate-500">$24.80</span> <span className="opacity-50 dark:text-slate-500">/</span> <span className="text-amber-500 font-medium">$12.40</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex items-start gap-4 hover:border-slate-300 dark:hover:border-white/20 transition-all hover:-translate-y-1">
          <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400 mt-1">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">总消耗 (Tokens/金额)</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">84.5M</h3>
            <p className="text-xs flex items-center gap-1 mt-1 flex-wrap">
              <span className="text-blue-500 font-medium">$840.50</span> <span className="opacity-50 dark:text-slate-500">/</span> <span className="text-slate-500">$1,200.00</span> <span className="opacity-50 dark:text-slate-500">/</span> <span className="text-amber-500 font-medium tracking-tight">$359.50</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex items-start gap-4 hover:border-slate-300 dark:hover:border-white/20 transition-all hover:-translate-y-1">
          <div className="p-3 bg-pink-50 dark:bg-pink-500/10 rounded-lg text-pink-600 dark:text-pink-400 mt-1">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">性能监控 (RPM/TPM)</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">45 <span className="text-sm font-normal text-slate-500">RPM</span></h3>
            <p className="text-xs text-emerald-500 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <Activity className="w-3 h-3" /> 系统运行平稳
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm flex items-start gap-4 hover:border-slate-300 dark:hover:border-white/20 transition-all hover:-translate-y-1">
          <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-lg text-red-600 dark:text-red-400 mt-1">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">平均响应</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">850ms</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">12 活跃用户</p>
          </div>
        </div>
      </div>

      {/* Main Full-Width Chart Card with Integrated Filters */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 flex flex-col shadow-sm shrink-0 min-h-[450px]">
        <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white whitespace-nowrap">聚合指标大盘</h3>
            <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden lg:block"></div>

            {/* Integrated Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={timeRange}
                  onChange={e => setTimeRange(e.target.value)}
                  className="appearance-none bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg pl-8 pr-8 py-1.5 text-xs focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white cursor-pointer transition-colors"
                >
                  {TIME_RANGES.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
                <Calendar className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={granularity}
                  onChange={e => setGranularity(e.target.value)}
                  className="appearance-none bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-xs focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white cursor-pointer transition-colors"
                >
                  {availableGranularities.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <button className="bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Chart Type Toggle */}
            <div className="flex bg-slate-100 dark:bg-[#121212] rounded-lg p-1 border border-slate-200 dark:border-white/5">
              <button
                onClick={() => setChartType('area')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${chartType === 'area' ? 'bg-white dark:bg-[#222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                折线图
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${chartType === 'bar' ? 'bg-white dark:bg-[#222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                柱状图
              </button>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>

            {/* Metric Toggle */}
            <div className="flex bg-slate-100 dark:bg-[#121212] rounded-lg p-1 border border-slate-200 dark:border-white/5">
              <button
                onClick={() => setTrendMetric('tokens')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${trendMetric === 'tokens' ? 'bg-white dark:bg-[#222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Token 消耗
              </button>
              <button
                onClick={() => setTrendMetric('cost')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${trendMetric === 'cost' ? 'bg-white dark:bg-[#222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                金额消耗
              </button>
              <button
                onClick={() => setTrendMetric('requests')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${trendMetric === 'requests' ? 'bg-white dark:bg-[#222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                API 请求
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative mt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={activeChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={trendMetric === 'cost' ? '#f59e0b' : trendMetric === 'requests' ? '#10b981' : '#3b82f6'} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={trendMetric === 'cost' ? '#f59e0b' : trendMetric === 'requests' ? '#10b981' : '#3b82f6'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" strokeOpacity={0.15} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val: number) => trendMetric === 'cost' ? `$${val}` : trendMetric === 'tokens' ? `${val/1000}k` : String(val)} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(150,150,150,0.2)', strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey={trendMetric}
                  stroke={trendMetric === 'cost' ? '#f59e0b' : trendMetric === 'requests' ? '#10b981' : '#3b82f6'}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMetric)"
                />
              </AreaChart>
            ) : (
              <BarChart data={activeChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" strokeOpacity={0.15} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val: number) => trendMetric === 'cost' ? `$${val}` : trendMetric === 'tokens' ? `${val/1000}k` : String(val)} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(150,150,150,0.1)' }} />
                <Bar
                  dataKey={trendMetric}
                  fill={trendMetric === 'cost' ? '#f59e0b' : trendMetric === 'requests' ? '#10b981' : '#3b82f6'}
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sub Charts (Model & Multimodal) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0 min-h-[360px]">

        {/* Left Chart Card: Model Distribution */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{chartTab}</h3>
            <div className="flex bg-slate-100 dark:bg-[#121212] rounded-lg p-1 border border-slate-200 dark:border-white/5">
              <button
                onClick={() => setChartTab('模型分布')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${chartTab === '模型分布' ? 'bg-white dark:bg-[#222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                模型分布
              </button>
              <button
                onClick={() => setChartTab('用户消费榜')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${chartTab === '用户消费榜' ? 'bg-white dark:bg-[#222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                用户消费榜
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0 relative">
            {chartTab === '模型分布' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelDistribution} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} width={140} />
                  <Tooltip cursor={{ fill: 'rgba(150,150,150,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                    {modelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userConsumptionData}
                    cx="40%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={4}
                  >
                    {userConsumptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}
                    formatter={(value) => `$${Number(value ?? 0)}`}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    content={<CustomPieLegend unit="$" />}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Chart Card: Multimodal Capabilities */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 flex flex-col shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">多模态能力调用占比</h3>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-slate-500"><Image className="w-3.5 h-3.5" /> 视觉</span>
              <span className="flex items-center gap-1 text-xs text-slate-500"><Mic className="w-3.5 h-3.5" /> 语音</span>
            </div>
          </div>
          <div className="flex-1 min-h-0 relative flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={multimodalData}
                  cx="40%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {multimodalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}
                  formatter={(value) => `${Number(value ?? 0)}%`}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  content={<CustomPieLegend unit="%" />}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Table */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm shrink-0 flex-1 mt-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">平台实时调用流水 (Live Traces)</h3>
          <button className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors gap-1">
            查看完整日志 <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-white/[0.02] border-y border-slate-200 dark:border-white/5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">调用方 (用户/API Key)</th>
                <th className="px-4 py-3">请求目标 (模型)</th>
                <th className="px-4 py-3">计费模式</th>
                <th className="px-4 py-3">消耗计费量 (In / Out | Count)</th>
                <th className="px-4 py-3">计算成本</th>
                <th className="px-4 py-3">请求时间</th>
                <th className="px-4 py-3">路由状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {recentUsage.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                       {item.isApiUser ? <Key className="w-3.5 h-3.5 text-indigo-500" /> : <Fingerprint className="w-3.5 h-3.5 text-slate-400" />}
                       <span className="font-medium text-slate-900 dark:text-slate-300">{item.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono font-medium items-center gap-1.5 shadow-sm">
                       {item.type === 'image' ? <Image className="w-3 h-3 text-amber-500" /> : <MessageSquare className="w-3 h-3 text-blue-500" />} {item.model}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.billingMode === 'token' ? (
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 tracking-wide">
                        按 Token
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 tracking-wide">
                        按 次数
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {item.billingMode === 'token' ? (
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400" title="Input Tokens">
                          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                            <ArrowDownRight className="w-3 h-3 text-emerald-500" />
                          </span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{item.usageIn?.toLocaleString()}</span>
                        </span>
                        <div className="w-px h-3 bg-slate-200 dark:bg-white/10"></div>
                        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400" title="Output Tokens">
                          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-500/10">
                            <ArrowUpRight className="w-3 h-3 text-blue-500" />
                          </span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{item.usageOut?.toLocaleString()}</span>
                        </span>
                      </div>
                    ) : (
                       <span className="text-slate-700 dark:text-slate-300 font-medium bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 flex items-center w-fit gap-1.5 shadow-sm">
                         <Activity className="w-3 h-3 text-amber-500" /> {item.usageCount} <span className="opacity-60 text-[10px]">REQS</span>
                       </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-emerald-600 dark:text-emerald-400">{item.cost}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px] tracking-tight">{item.time}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded w-fit border border-emerald-100 dark:border-emerald-500/20">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 成功
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
