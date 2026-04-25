import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
<<<<<<< HEAD
import { OpenCodeReader } from './opencode-reader'

type DateRange = 'today' | 'week' | 'month' | 'all'

async function getVersion(cliName: string): Promise<string | null> {
  try {
    const result = Bun.spawnSync([cliName, '--version'], { timeout: 5000 })
    if (result.exitCode === 0) {
      return result.stdout.toString().trim()
    }
    return null
  } catch {
    return null
  }
}

const cachedVersions = {
  opencode: await getVersion('opencode'),
  ohMyOpenCode: await getVersion('oh-my-opencode'),
}

export function createApp() {
  const app = new Hono()
  app.use('/*', cors())

  const reader = new OpenCodeReader()

  app.get('/api/stats', async (c) => {
    const range = (c.req.query('range') ?? 'all') as DateRange
    return c.json(await reader.getStats(range))
  })

  app.get('/api/agents/active', async (c) => {
    return c.json(await reader.getActiveAgents())
  })

  app.get('/api/sessions', async (c) => {
    const range = (c.req.query('range') ?? 'all') as DateRange
    return c.json(await reader.getSessions(range))
  })

  app.get('/api/sessions/:id/messages', async (c) => {
    return c.json(await reader.getSessionDetail(c.req.param('id')))
  })

  app.delete('/api/sessions/:id', async (c) => {
    try {
      const id = c.req.param('id')
      await reader.deleteSession(id)
      return c.json({ success: true, message: 'Session deleted' })
    } catch (error) {
      return c.json({ success: false, error: 'Failed to delete session' }, 500)
    }
  })

  app.get('/api/agents/usage', async (c) => {
    const range = (c.req.query('range') ?? 'all') as DateRange
    return c.json(await reader.getAgentUsage(range))
  })

  app.get('/api/cost-history', async (c) => {
    return c.json(await reader.getCostHistory())
  })

  app.get('/api/models', async (c) => {
    return c.json(await reader.getModelUsage())
  })

  app.get('/api/activity', async (c) => {
    return c.json(await reader.getHourlyActivity())
  })

  app.get('/api/version', async (c) => {
    return c.json({
      opencode: cachedVersions.opencode || 'unknown',
      ohMyOpenCode: cachedVersions.ohMyOpenCode || 'unknown',
    })
  })

  return app
}

// Run directly with tsx (dev mode)
const isDirectRun = process.argv[1]?.endsWith('server/index.ts') ||
  process.argv[1]?.endsWith('server/index.js')

if (isDirectRun) {
  const app = createApp()
  const port = 3456
  console.log(`🚀 OhMyDashboard API running on http://localhost:${port}`)
  console.log(`📂 Reading data from ~/.local/share/opencode/storage/`)
  serve({ fetch: app.fetch, port })
}
=======
import type { DashboardStats, AgentActivity, Session, AgentUsage } from '../src/types/opencode'

const app = new Hono()
app.use('/*', cors())

// ── Mock Data ──────────────────────────────────────────────

const now = Date.now()
const HOUR = 3_600_000
const DAY = 86_400_000

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const mockSessions: Session[] = [
  {
    id: 'ses_3b4f698e4ffen2QFyY5HmP4pHQ',
    title: 'OhMyDashboard brainstorm',
    directory: '/Users/macbook/Documents/Work/SysArch',
    projectId: 'proj_sysarch',
    messageCount: 47,
    cost: 3.82,
    agents: ['sisyphus', 'explore', 'librarian', 'prometheus'],
    time: { created: now - 2 * HOUR, updated: now - 5 * 60_000 },
  },
  {
    id: 'ses_3b749dab1ffeKL9mXp2wR7qNbZ',
    title: 'Odoo module development',
    directory: '/Users/macbook/Documents/Work/SysArch',
    projectId: 'proj_sysarch',
    messageCount: 432,
    cost: 12.47,
    agents: ['sisyphus', 'oracle', 'explore', 'metis'],
    time: { created: now - DAY - 6 * HOUR, updated: now - DAY },
  },
  {
    id: 'ses_3be5ca7f2ffeJP8nYw4xS5tMaQ',
    title: 'Focus app refactoring',
    directory: '/Users/macbook/Documents/Work/focus',
    projectId: 'proj_focus',
    messageCount: 265,
    cost: 8.91,
    agents: ['sisyphus', 'oracle', 'librarian'],
    time: { created: now - 2 * DAY, updated: now - 1.5 * DAY },
  },
  {
    id: 'ses_4a1b2c3d4ffeAB5cDE6fGH7iJK',
    title: 'Content strategy planning',
    directory: '/Users/macbook/Documents/Work/SysArch',
    projectId: 'proj_sysarch',
    messageCount: 89,
    cost: 2.15,
    agents: ['sisyphus', 'momus'],
    time: { created: now - 3 * DAY, updated: now - 2.8 * DAY },
  },
  {
    id: 'ses_5x6y7z8w9ffeQR0sST1uUV2wXY',
    title: 'WordPress theme build',
    directory: '/Users/macbook/Documents/Work/justworkonit',
    projectId: 'proj_justworkonit',
    messageCount: 156,
    cost: 5.33,
    agents: ['sisyphus', 'explore', 'librarian', 'atlas'],
    time: { created: now - 4 * DAY, updated: now - 3.5 * DAY },
  },
  {
    id: 'ses_6m7n8o9p0ffeWX1yYZ2aAB3cDE',
    title: 'Debugging auth flow',
    directory: '/Users/macbook/Documents/Work/focus',
    projectId: 'proj_focus',
    messageCount: 78,
    cost: 4.67,
    agents: ['sisyphus', 'oracle', 'explore'],
    time: { created: now - 5 * DAY, updated: now - 4.5 * DAY },
  },
]

const mockActiveAgents: AgentActivity[] = [
  {
    agent: 'sisyphus',
    directory: '/Users/macbook/Documents/Work/SysArch',
    status: 'running',
    sessionId: 'ses_3b4f698e4ffen2QFyY5HmP4pHQ',
    elapsedMs: 12 * 60_000 + 34_000,
    model: 'claude-sonnet-4.5',
    messageCount: 47,
  },
  {
    agent: 'explore',
    directory: '/Users/macbook/Documents/Work/SysArch',
    status: 'running',
    sessionId: 'ses_3b4f698e4ffen2QFyY5HmP4pHQ',
    elapsedMs: 8 * 60_000 + 12_000,
    model: 'gpt-5-mini',
    messageCount: 15,
  },
  {
    agent: 'librarian',
    directory: '/Users/macbook/Documents/Work/SysArch',
    status: 'running',
    sessionId: 'ses_3b4f698e4ffen2QFyY5HmP4pHQ',
    elapsedMs: 8 * 60_000 + 5_000,
    model: 'claude-sonnet-4.5',
    messageCount: 12,
  },
  {
    agent: 'oracle',
    directory: '/Users/macbook/Documents/Work/SysArch',
    status: 'idle',
    sessionId: 'ses_3b4f698e4ffen2QFyY5HmP4pHQ',
    elapsedMs: 0,
    model: 'gpt-5.2',
    messageCount: 0,
  },
  {
    agent: 'prometheus',
    directory: '/Users/macbook/Documents/Work/SysArch',
    status: 'completed',
    sessionId: 'ses_3b4f698e4ffen2QFyY5HmP4pHQ',
    elapsedMs: 3 * 60_000 + 45_000,
    model: 'claude-opus-4.5',
    messageCount: 8,
  },
]

function computeUsage(): AgentUsage[] {
  const counts: Record<string, { count: number; messages: number }> = {}
  for (const session of mockSessions) {
    for (const agent of session.agents) {
      if (!counts[agent]) counts[agent] = { count: 0, messages: 0 }
      counts[agent].count++
      counts[agent].messages += Math.floor(session.messageCount / session.agents.length)
    }
  }
  const total = Object.values(counts).reduce((sum, v) => sum + v.count, 0)
  return Object.entries(counts)
    .map(([agent, { count, messages }]) => ({
      agent,
      count,
      percentage: Math.round((count / total) * 100),
      totalMessages: messages,
    }))
    .sort((a, b) => b.count - a.count)
}

function computeStats(): DashboardStats {
  return {
    totalSessions: mockSessions.length,
    totalMessages: mockSessions.reduce((sum, s) => sum + s.messageCount, 0),
    totalCost: parseFloat(mockSessions.reduce((sum, s) => sum + s.cost, 0).toFixed(2)),
    activeAgents: mockActiveAgents.filter((a) => a.status === 'running').length,
  }
}

// ── API Routes ─────────────────────────────────────────────

app.get('/api/stats', (c) => {
  return c.json(computeStats())
})

app.get('/api/agents/active', (c) => {
  // Simulate slight elapsed time changes on each poll
  const agents = mockActiveAgents.map((a) => ({
    ...a,
    elapsedMs: a.status === 'running' ? a.elapsedMs + randomBetween(1000, 5000) : a.elapsedMs,
  }))
  return c.json(agents)
})

app.get('/api/sessions', (c) => {
  return c.json(mockSessions)
})

app.get('/api/agents/usage', (c) => {
  return c.json(computeUsage())
})

// ── Start Server ───────────────────────────────────────────

const port = 3456
console.log(`🚀 OhMyDashboard API running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })
>>>>>>> 6533805 (feat: first commit ⚡)
