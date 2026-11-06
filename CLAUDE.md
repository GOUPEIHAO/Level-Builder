# LevelForge AI Guide (Claude Code & OpenAI Codex)

This workspace is **LevelForge**, a Web-based Greybox Level Design & Spatial Analysis Workbench with synchronized **3D Blockout**, **2D Top-Down Plan View**, and **2D Real-Time Cross-Section ($A\text{--}A'$)**.

## 1. Coordinate System & Metrics Convention
- **Units**: `1.0` = `1 meter`.
- **Axes**: Right-handed Y-up (`+X` = East, `-X` = West, `+Y` = Up/Elevation, `-Z` = North/Forward, `+Z` = South).
- **Block `position`**: `[x, y, z]` is the **center** of the bounding box.
  - Example: A floor slab of thickness `0.5m` whose top surface is at `Y = 0.0m` has `position: [x, -0.25, z]` and `size: [w, 0.5, d]`.
  - Example: A low cover wall of height `1.1m` standing on `Y = 0.0m` has `position: [x, 0.55, z]` and `size: [w, 1.1, d]`.
- **Block `type`**: `'box' | 'ramp' | 'stairs' | 'arch' | 'cylinder'` (Ramps and stairs ascend from local `+Z` bottom to local `-Z` top when `rotation = [0, 0, 0]`).
- **Block `role`**: `'walkable' | 'wall' | 'cover_low' | 'cover_full' | 'climbable' | 'hazard' | 'trigger_combat' | 'trigger_puzzle' | 'water' | 'objective'`.

## 2. Three Ways AI Agents Can Inspect & Modify the Level

### Way A: CLI Commands (`npm run ai -- ...`)
Run atomic or batch commands from the shell (automatically updates `levels/current.level.json` and hot-syncs the open Web UI):
```bash
# 1. Inspect current level summary, blocks, cross-section & audit issues
npm run ai -- status

# 2. Add a greybox block
npm run ai -- add-block --name "二层东侧高台" --type box --role walkable --pos 8,2.75,-6 --size 6,0.5,8 --floor 1

# 3. Generate an enclosed room with arch doorways
npm run ai -- generate-room --name "北侧Boss厅" --center 0,3,-22 --size 16,5,16 --floor 1 --doors south

# 4. Move the cross-section cut plane A-A' and inspect sliced geometry
npm run ai -- set-section --start -15,-2 --end 15,-2 --slab 10

# 5. Verify if a jump between two platforms is reachable
npm run ai -- check-jump --from -8,3,-2 --to -4.5,3,-2

# 6. Check 3D Line-of-Sight (LOS) between two points
npm run ai -- analyze-los --from 2.5,4.65,-7.8 --to 0,1.65,8

# 7. Execute batch JSON commands
npm run ai -- exec-json --json '[{"action":"scatter_cover","boundsMin":[-6,0,-4],"boundsMax":[6,0,6],"count":4}]'
```

### Way B: Direct File Editing (`levels/current.level.json`)
Edit `levels/current.level.json` directly. The Bridge Server (`npm run bridge`) watches this file with `chokidar` and immediately broadcasts updates to the Web UI via WebSocket.

### Way C: Model Context Protocol (MCP) Server
Add the built-in MCP server to Claude Code:
```bash
claude mcp add levelforge -- npx tsx server/mcp-server.ts
```
