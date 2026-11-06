import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
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
const LEVEL_FILE_PATH = path.resolve(__dirname, '../levels/current.level.json');

function loadLevel(): LevelDocument {
  if (!fs.existsSync(LEVEL_FILE_PATH)) {
    const dir = path.dirname(LEVEL_FILE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const doc = createTacticalCourtyardLevel();
    fs.writeFileSync(LEVEL_FILE_PATH, JSON.stringify(doc, null, 2), 'utf-8');
    return doc;
  }
  return JSON.parse(fs.readFileSync(LEVEL_FILE_PATH, 'utf-8')) as LevelDocument;
}

async function saveLevel(doc: LevelDocument, message: string): Promise<void> {
  fs.writeFileSync(LEVEL_FILE_PATH, JSON.stringify(doc, null, 2), 'utf-8');
  try {
    await fetch('http://127.0.0.1:4399/api/level', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc, message }),
    });
  } catch {
    // bridge server optional
  }
}

const TOOLS = [
  {
    name: 'get_level_summary',
    description:
      'Get the current LevelForge greybox level document, block list, character metrics, cross-section slice summary, and automated level design audit report.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'execute_level_command',
    description:
      'Execute one or more LevelForge commands (add_block, update_block, delete_block, add_poi, generate_room, scatter_cover, mirror_blocks, set_section, update_metrics) and immediately sync to the 2D/3D web editor.',
    inputSchema: {
      type: 'object',
      properties: {
        commands: {
          type: 'array',
          description: 'Array of AICommandAction objects to execute sequentially',
          items: { type: 'object' },
        },
      },
      required: ['commands'],
    },
  },
  {
    name: 'check_jump_reachability',
    description:
      'Evaluate whether a player jump from 3D point A to 3D point B is safe, stretch, requires double-jump, blocked by geometry, or impossible under the current character metrics.',
    inputSchema: {
      type: 'object',
      properties: {
        from: { type: 'array', items: { type: 'number' }, description: '[x, y, z] takeoff coordinates in meters' },
        to: { type: 'array', items: { type: 'number' }, description: '[x, y, z] landing coordinates in meters' },
      },
      required: ['from', 'to'],
    },
  },
  {
    name: 'analyze_sightline',
    description:
      'Perform a 3D Line-of-Sight (LOS) raycast between two 3D points (e.g. sniper nest to cover position) to check if sightline is clear or blocked by any greybox geometry.',
    inputSchema: {
      type: 'object',
      properties: {
        from: { type: 'array', items: { type: 'number' }, description: '[x, y, z] observer eye coordinates' },
        to: { type: 'array', items: { type: 'number' }, description: '[x, y, z] target coordinates' },
      },
      required: ['from', 'to'],
    },
  },
];

function sendResponse(id: number | string | null, result: unknown): void {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n');
}

function sendError(id: number | string | null, code: number, message: string): void {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }) + '\n');
}

const rl = readline.createInterface({ input: process.stdin, terminal: false });

rl.on('line', async (line) => {
  if (!line.trim()) return;
  try {
    const req = JSON.parse(line);
    const { id, method, params } = req;

    if (method === 'initialize') {
      sendResponse(id, {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'levelforge-mcp', version: '1.0.0' },
      });
      return;
    }

    if (method === 'notifications/initialized') {
      return;
    }

    if (method === 'tools/list') {
      sendResponse(id, { tools: TOOLS });
      return;
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      const args = params?.arguments || {};
      const doc = loadLevel();

      if (toolName === 'get_level_summary') {
        const audit = auditLevel(doc);
        const cross = computeCrossSection(doc);
        sendResponse(id, {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  metadata: doc.metadata,
                  metricsProfile: doc.metricsProfile,
                  sectionPlane: doc.sectionPlane,
                  crossSectionSummary: {
                    sectionLength: cross.sectionLength,
                    slicedBlocks: cross.items.map((i) => ({
                      id: i.block.id,
                      name: i.block.name,
                      role: i.block.role,
                      slopeAngle: i.slopeAngle,
                      warning: i.warning,
                    })),
                  },
                  audit,
                  blocks: doc.blocks,
                  pois: doc.pois,
                  paths: doc.paths,
                  jumps: doc.jumps,
                },
                null,
                2
              ),
            },
          ],
        });
        return;
      }

      if (toolName === 'execute_level_command') {
        const commands: AICommandAction[] = Array.isArray(args.commands) ? args.commands : [args.commands];
        let nextDoc = doc;
        const messages: string[] = [];
        const affectedIds: string[] = [];
        for (const cmd of commands) {
          const res = applyAICommand(nextDoc, cmd);
          nextDoc = res.doc;
          messages.push(res.message);
          affectedIds.push(...res.affectedIds);
        }
        await saveLevel(nextDoc, `[MCP] ${messages.join(' | ')}`);
        sendResponse(id, {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  ok: true,
                  messages,
                  affectedIds,
                  audit: auditLevel(nextDoc),
                },
                null,
                2
              ),
            },
          ],
        });
        return;
      }

      if (toolName === 'check_jump_reachability') {
        const res = evaluateJumpLink(args.from as Vec3, args.to as Vec3, doc.metricsProfile, doc.blocks);
        sendResponse(id, {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }],
        });
        return;
      }

      if (toolName === 'analyze_sightline') {
        const res = raycastLevel3D(args.from as Vec3, args.to as Vec3, doc.blocks);
        sendResponse(id, {
          content: [{ type: 'text', text: JSON.stringify(res, null, 2) }],
        });
        return;
      }

      sendError(id, -32601, `Unknown tool: ${toolName}`);
      return;
    }

    if (id !== undefined) {
      sendResponse(id, {});
    }
  } catch (err) {
    sendError(null, -32700, (err as Error).message);
  }
});
