import chokidar from 'chokidar';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocket, WebSocketServer } from 'ws';
import {
  applyAICommand,
  auditLevel,
  computeCrossSection,
  evaluateJumpLink,
  raycastLevel3D,
} from '../src/core/geometry-analysis';
import { createTacticalCourtyardLevel } from '../src/core/presets';
import { AICommandAction, LevelDocument, Vec3 } from '../src/core/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const LEVEL_FILE_PATH = path.resolve(__dirname, '../levels/current.level.json');

export function loadOrCreateLevelFile(): LevelDocument {
  const dir = path.dirname(LEVEL_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LEVEL_FILE_PATH)) {
    const initial = createTacticalCourtyardLevel();
    fs.writeFileSync(LEVEL_FILE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(LEVEL_FILE_PATH, 'utf-8');
    return JSON.parse(raw) as LevelDocument;
  } catch {
    const fallback = createTacticalCourtyardLevel();
    fs.writeFileSync(LEVEL_FILE_PATH, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

let currentDoc: LevelDocument = loadOrCreateLevelFile();
let lastDiskWriteTime = 0;

function saveLevelToDisk(doc: LevelDocument): void {
  lastDiskWriteTime = Date.now();
  currentDoc = doc;
  const dir = path.dirname(LEVEL_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(LEVEL_FILE_PATH, JSON.stringify(doc, null, 2), 'utf-8');
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

function broadcastLevel(message?: string, excludeWs?: WebSocket): void {
  const payload = JSON.stringify({
    type: 'level_updated',
    doc: currentDoc,
    message,
  });
  for (const client of wss.clients) {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(String(raw));
      if (msg.type === 'client_update' && msg.doc) {
        saveLevelToDisk(msg.doc);
        broadcastLevel('Web 视口编辑同步', ws);
      }
    } catch {
      // ignore invalid message
    }
  });
});

// Watch `levels/current.level.json` so direct edits by Claude Code / Codex or CLI immediately push to browser
chokidar.watch(LEVEL_FILE_PATH, { ignoreInitial: true }).on('change', () => {
  if (Date.now() - lastDiskWriteTime < 800) return;
  try {
    const raw = fs.readFileSync(LEVEL_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as LevelDocument;
    if (parsed && Array.isArray(parsed.blocks)) {
      currentDoc = parsed;
      broadcastLevel('检测到 levels/current.level.json 外部 AI 修改，已自动热更新');
    }
  } catch {
    // ignore partial file write
  }
});

// REST API for Claude / Codex / Scripts
app.get('/api/level', (_req, res) => {
  const audit = auditLevel(currentDoc);
  const cross = computeCrossSection(currentDoc);
  res.json({
    doc: currentDoc,
    audit,
    crossSection: {
      sectionLength: cross.sectionLength,
      slicedBlockCount: cross.items.length,
      slicedBlocks: cross.items.map((i) => ({
        id: i.block.id,
        name: i.block.name,
        role: i.block.role,
        slopeAngle: i.slopeAngle,
        warning: i.warning,
      })),
    },
  });
});

app.put('/api/level', (req, res) => {
  const { doc, message } = req.body;
  if (!doc || !Array.isArray(doc.blocks)) {
    res.status(400).json({ error: 'Invalid LevelDocument payload' });
    return;
  }
  saveLevelToDisk(doc);
  broadcastLevel(message || 'PUT /api/level 全量更新');
  res.json({ ok: true, audit: auditLevel(currentDoc) });
});

app.post('/api/command', (req, res) => {
  const body = req.body;
  const commands: AICommandAction[] = Array.isArray(body.command)
    ? body.command
    : body.command
    ? [body.command]
    : Array.isArray(body)
    ? body
    : [body];

  const messages: string[] = [];
  const affectedIds: string[] = [];
  let nextDoc = currentDoc;

  for (const cmd of commands) {
    const out = applyAICommand(nextDoc, cmd);
    nextDoc = out.doc;
    messages.push(out.message);
    affectedIds.push(...out.affectedIds);
  }

  saveLevelToDisk(nextDoc);
  broadcastLevel(messages.join(' | '));

  res.json({
    ok: true,
    messages,
    affectedIds,
    audit: auditLevel(currentDoc),
  });
});

app.post('/api/analyze-los', (req, res) => {
  const { from, to } = req.body as { from: Vec3; to: Vec3 };
  if (!Array.isArray(from) || !Array.isArray(to)) {
    res.status(400).json({ error: 'Provide from: [x,y,z] and to: [x,y,z]' });
    return;
  }
  const result = raycastLevel3D(from, to, currentDoc.blocks);
  res.json(result);
});

app.post('/api/check-jump', (req, res) => {
  const { from, to } = req.body as { from: Vec3; to: Vec3 };
  if (!Array.isArray(from) || !Array.isArray(to)) {
    res.status(400).json({ error: 'Provide from: [x,y,z] and to: [x,y,z]' });
    return;
  }
  const result = evaluateJumpLink(from, to, currentDoc.metricsProfile, currentDoc.blocks);
  res.json(result);
});

const PORT = Number(process.env.LEVELFORGE_PORT || 4399);
server.listen(PORT, '127.0.0.1', () => {
  console.log(`[LevelForge Bridge] Listening on http://127.0.0.1:${PORT}`);
  console.log(`[LevelForge Bridge] Watching file: ${LEVEL_FILE_PATH}`);
});
