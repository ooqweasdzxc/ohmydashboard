import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
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

  app.patch('/api/sessions/:id/archive', async (c) => {
    try {
      const id = c.req.param('id')
      const body = await c.req.json<{ archived: boolean }>()
      await reader.setArchiveStatus(id, body.archived)
      return c.json({ success: true, archived: body.archived })
    } catch (error) {
      return c.json({ success: false, error: 'Failed to update archive status' }, 500)
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
