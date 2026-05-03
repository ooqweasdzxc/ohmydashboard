import { Database } from 'bun:sqlite'
import path from 'path'
import os from 'os'
import fs from 'fs'

const DB_DIR = path.join(os.homedir(), '.local/share/ohmydashboard')
const DB_PATH = path.join(DB_DIR, 'archive.db')

export class ArchiveStore {
  private db: Database | null = null

  private getDb(): Database {
    if (!this.db) {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true })
      }
      this.db = new Database(DB_PATH)
      this.db.exec('PRAGMA busy_timeout = 5000')
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS archive (
          session_id TEXT PRIMARY KEY,
          archived INTEGER NOT NULL DEFAULT 1,
          updated_at INTEGER NOT NULL
        )
      `)
    }
    return this.db
  }

  setArchived(sessionId: string, archived: boolean): void {
    const db = this.getDb()
    db.run(
      'INSERT OR REPLACE INTO archive (session_id, archived, updated_at) VALUES (?, ?, ?)',
      [sessionId, archived ? 1 : 0, Date.now()]
    )
  }

  getArchivedIds(): Set<string> {
    const db = this.getDb()
    const rows = db.query('SELECT session_id FROM archive WHERE archived = 1').all() as { session_id: string }[]
    return new Set(rows.map(r => r.session_id))
  }

  removeEntry(sessionId: string): void {
    const db = this.getDb()
    db.run('DELETE FROM archive WHERE session_id = ?', [sessionId])
  }

  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}
