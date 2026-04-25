import { useState, useEffect, useCallback, useRef } from 'react'
<<<<<<< HEAD
import type { DashboardStats, AgentActivity, Session, AgentUsage, CostHistoryEntry, ModelUsage, HourlyActivity, DateRange } from '@/types/opencode'
=======
import type { DashboardStats, AgentActivity, Session, AgentUsage } from '@/types/opencode'
>>>>>>> 6533805 (feat: first commit ⚡)

interface DashboardData {
  stats: DashboardStats | null
  agents: AgentActivity[]
  sessions: Session[]
  usage: AgentUsage[]
<<<<<<< HEAD
  costHistory: CostHistoryEntry[]
  models: ModelUsage[]
  activity: HourlyActivity[]
=======
>>>>>>> 6533805 (feat: first commit ⚡)
  loading: boolean
  error: string | null
  lastUpdated: number | null
  refresh: () => void
  secondsUntilRefresh: number
<<<<<<< HEAD
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
=======
>>>>>>> 6533805 (feat: first commit ⚡)
}

const REFRESH_INTERVAL = 15_000

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}

export function useDashboardData(): DashboardData {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [agents, setAgents] = useState<AgentActivity[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [usage, setUsage] = useState<AgentUsage[]>([])
<<<<<<< HEAD
  const [costHistory, setCostHistory] = useState<CostHistoryEntry[]>([])
  const [models, setModels] = useState<ModelUsage[]>([])
  const [activity, setActivity] = useState<HourlyActivity[]>([])
=======
>>>>>>> 6533805 (feat: first commit ⚡)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(REFRESH_INTERVAL / 1000)
<<<<<<< HEAD
  const [dateRange, setDateRange] = useState<DateRange>('all')
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval>>(null)

  const fetchData = useCallback(async (range: DateRange) => {
    try {
      setError(null)
      const rangeParam = `?range=${range}`
      const [statsData, agentsData, sessionsData, usageData, costData, modelsData, activityData] = await Promise.all([
        fetchJSON<DashboardStats>(`/api/stats${rangeParam}`),
        fetchJSON<AgentActivity[]>('/api/agents/active'),
        fetchJSON<Session[]>(`/api/sessions${rangeParam}`),
        fetchJSON<AgentUsage[]>(`/api/agents/usage${rangeParam}`),
        fetchJSON<CostHistoryEntry[]>('/api/cost-history'),
        fetchJSON<ModelUsage[]>('/api/models'),
        fetchJSON<HourlyActivity[]>('/api/activity'),
=======
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval>>(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const [statsData, agentsData, sessionsData, usageData] = await Promise.all([
        fetchJSON<DashboardStats>('/api/stats'),
        fetchJSON<AgentActivity[]>('/api/agents/active'),
        fetchJSON<Session[]>('/api/sessions'),
        fetchJSON<AgentUsage[]>('/api/agents/usage'),
>>>>>>> 6533805 (feat: first commit ⚡)
      ])
      setStats(statsData)
      setAgents(agentsData)
      setSessions(sessionsData)
      setUsage(usageData)
<<<<<<< HEAD
      setCostHistory(costData)
      setModels(modelsData)
      setActivity(activityData)
=======
>>>>>>> 6533805 (feat: first commit ⚡)
      setLastUpdated(Date.now())
      setSecondsUntilRefresh(REFRESH_INTERVAL / 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
<<<<<<< HEAD
    fetchData(dateRange)
    timerRef.current = setInterval(() => fetchData(dateRange), REFRESH_INTERVAL)
=======
    fetchData()
    timerRef.current = setInterval(fetchData, REFRESH_INTERVAL)
>>>>>>> 6533805 (feat: first commit ⚡)
    countdownRef.current = setInterval(() => {
      setSecondsUntilRefresh((s) => Math.max(0, s - 1))
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
<<<<<<< HEAD
  }, [fetchData, dateRange])

  const refresh = useCallback(() => {
    setLoading(true)
    fetchData(dateRange)
  }, [fetchData, dateRange])

  return { stats, agents, sessions, usage, costHistory, models, activity, loading, error, lastUpdated, refresh, secondsUntilRefresh, dateRange, setDateRange }
=======
  }, [fetchData])

  const refresh = useCallback(() => {
    setLoading(true)
    fetchData()
  }, [fetchData])

  return { stats, agents, sessions, usage, loading, error, lastUpdated, refresh, secondsUntilRefresh }
>>>>>>> 6533805 (feat: first commit ⚡)
}
