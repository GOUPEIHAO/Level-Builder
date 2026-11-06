# LevelForge�E�专业白盒�E卡设计丁EAI 协同平台实现方桁E
## 1. 目栁E��核忁E��佁E
极E��一套面向专业游戏�E卡设计师的 Web 端白盒！Ereybox / Blockout�E�快速原型与�E析工作台 **LevelForge**。该工具不仁E��现 **2D 俯见E�� + 3D 透见E�� + 动态断面图�E�Eross-Section�E�E* 皁E��向实时联动编辑，还�E置专业�E卡设计度量衡�E�Eetrics�E�、见E��遮挡�E�EOS�E�、动线节奏�E析、实机漫游测试，并原生釁E�� **AI-First 架极E*�E�让 **Claude Code、OpenAI Codex 筁EAI 编程与设计 Agent** 可以通迁ECLI、REST API、MCP Server 或直接读写结构匁EJSON DSL 来实时查询、生成、修改和审查关卡、E
---

## 2. 系统架极E��计

为亁E��时满足浏览器端极�E流畅皁E��形交互，以及本地 **Claude / Codex** 命令行的无缝实时谁E���E�项目釁E�� **Vite + TypeScript + Three.js + 本地轻量同步桥�E�Eode.js API & WebSocket & MCP Server�E�E* 架极E��E
```mermaid
flowchart LR
    subgraph AI_Agents["AI Agents & 外部工具"]
        Claude["Claude Code / Desktop (MCP / CLI)"]
        Codex["Codex / AI 脚本 (CLI / REST)"]
        Engine["Unity / Unreal (GLTF / OBJ / JSON)"]
    end

    subgraph Bridge["本地 AI 协同服务 (server / cli)"]
        MCPServer["MCP Server (Stdio / HTTP)"]
        REST["REST & Command API (/api/level)"]
        WS["WebSocket 实时同步总线"]
        FileStore["level-data.json (磁盘热重载)"]
    end

    subgraph WebApp["LevelForge Web 工作台 (Three.js + Canvas 2D)"]
        Store["中央状态与命令引擎 (Undo/Redo + Action Dispatcher)"]
        View3D["3D 白盒主见E�� (Three.js + Transform/CSG/Playtest)"]
        ViewTop["2D 俯见E��图见E�� (拉桁E��模/动线/见E��/网格栁E��)"]
        ViewSec["2D 实时断面见E�� (任意�E面 A-A' 剖面高度/跳跁E��线校骁E"]
        Inspector["专业�E卡持E��E��板 (Metrics / LOS / 节奁E/ AI 终端)"]
    end

    Claude <--> MCPServer
    Codex <--> REST
    Claude <--> FileStore
    Codex <--> FileStore
    MCPServer <--> REST
    REST <--> FileStore
    FileStore <--> WS
    WS <--> Store
    Store <--> View3D
    Store <--> ViewTop
    Store <--> ViewSec
    Store <--> Inspector
    WebApp --> Engine
```

> [!IMPORTANT]
> **为什么采用“本地磁盘 JSON 热监听 + REST/MCP + 浏览器全局变量”三合一 AI 桥接�E�E*
> 1. **直接改斁E��即可生效**�E�Claude 戁ECodex 最擁E��直接读冁EJSON 或运行�E本。本地服务通迁E`chokidar` 监听 `levels/current.level.json`�E�AI 修改该斁E��保存的瞬间�E�网页 3D/俯见E断面见E��自动无感热更新、E> 2. **CLI 原子命令操佁E*�E�提侁E`npx levelforge-cli` 命令�E�妁E`add-box`、`add-ramp`、`connect-rooms`、`analyze-metrics`、`slice-section`�E�，方便 Claude/Codex 在终端用一行命令完�E精凁E��建与空间拓扑验证、E> 3. **栁E�� MCP (Model Context Protocol) 支持E*�E��E置 `mcp-server.ts`�E�可直接配置到 Claude Code / Claude Desktop�E�封E�E卡操作暴露为原生 AI Tools、E
---

## 3. 核忁E��能模块设计

### 3.1 2D 丁E3D 双向联动 + 动态断面图�E�三见E��协同�E�E支持单屏聚焦、左 3D 右叁E2D�E�俯见E断面�E�、四见E��等�E活币E���E�E1. **2D 俯见E���E�Eop-Down Blueprint View�E�E*�E�E   - **拉桁E��白盒！Eraw-to-Blockout�E�E*�E�在 2D 网格上直接拖拽矩形、走廊折线、多边形区域，实时生�E对应楼层与高度皁E3D 白盒、E   - **高度刁E��与高程热力着色�E�Elevation Coding�E�E*�E�按 Y 轴高度自动映封E��高色谁E�E栁E��数字（妁E`+0.0m`, `+3.5m`�E�，支持按楼层！Eayer/Floor�E�迁E��显示避免上下重叠遮挡、E   - **断面刁E��控制器�E�Eection Cut Line $A\text{--}A'$�E�E*�E�在俯见E��上可任意拖拽旋转一条刁E��线 $A\text{--}A'$ 及�E牁E��度�E�Elab Depth�E�、E2. **2D 动态断面图�E�Eross-Section View�E�E*�E�E   - **实时平面求交�E�Eesh-Plane Intersection�E�E*�E�根据俯见E��中皁E�E面线 $A\text{--}A'$�E�实时计算所朁E3D 白盒�E何体与�E平面皁E��确交线轮廓，被刁E��皁E��忁E��显示专业建筑斜线填允E��Eatching�E�，�E牁E��度冁E��远景结构显示淡色投影线、E   - **断面直接编辁E*�E�在断面图中可直接上下拖拽地面/天花板/掩体的高度�E��E测量垂直净空高度�E�Eeadroom�E�、E��低差、跳跁E��达性、E3. **3D 透见E正交主见E���E�ED Blockout Viewport�E�E*�E�E   - 支持基础白盒体素/几何原语�E�E*长方体！Eox/Wall/Floor�E�、斜坡�E�Eamp/Wedge�E�、楼梯�E�Etairs�E��E动按踏步高宽比生成）、圆柱�E�Eylinder�E�、拱门/门洞！Erch/Doorway�E�E*、E   - 冁E�� **Grid Triplanar 棋盘格栁E��材质�E�Em ÁE1m 栁E��世界坐栁EUV�E�E*�E�拉伸几何体时纹琁E��拉伸�E�一眼看�E真实米数尺度、E   - 支持EGizmo 移动/旋转/缩放、E��推拉！Eush/Pull Face�E�与模数吸陁E��E.25m / 0.5m / 1m / 2m 及角度 15°/45°/90° 吸陁E��、E
---

### 3.2 专业�E卡设计师工具箱�E�Ero LD Toolkit�E�E
| 工具类别 | 具体功能绁E�� |
| :--- | :--- |
| **1. 角色尺度与运动度量衡 (Character & Movement Metrics)** | • **可配置角色胶囊参数**�E��E定义角色身高（妁E`1.8m`�E�、半征E��E0.4m`�E�、蹲姿高度�E�E1.0m`�E�、走/跑速度�E�E4m/s`、`6.5m/s`�E�、最大爬坡角（妁E`45°`�E�、最大跨步高！Etep Offset `0.35m`�E�、Ebr>• **跳跁E��攀爬能力计算器**�E�输�E跳跁E��度�E�妁E`1.6m`�E�、跨越水平距离�E�妁E`4.5m`�E�、二段跳/冲刺参数�E�E*在 3D 见E��、俯见E��和断面图中同时绘制抛物线跳跁E��络线�E�Eump Arc & Landing Zone�E�E*�E��E动判定两个平台之间是“安�E可达 / 极E��可达 / 不可达”、Ebr>• **爬坡与净空违见E��亮**�E��E动检测斜坡角度是否趁E��E��色最大爬坡角、E��道高度是否低于角色身髁E蹲高，并在断面图丁E3D 见E��中以警告色提示、E|
| **2. 见E��与掩体�E极E(LOS, Vision Cone & Cover Analysis)** | • **交互式观察点/敌人见E��锥�E�Eision Cone / Sniper LOS�E�E*�E�放置观察点或巡逻守卫�E�设置见E��！EOV 妁E`90°`�E�、见E��（妁E`25m`�E�、眼高！E1.6m`�E�，利用实时封E��步进！Eaycasting�E�在 2D 俯见E��咁E3D 见E��中绘制**真实阴影遮挡后的可见扇区�E�Eisibility Polygon�E�E*、Ebr>• **掩体高度自动刁E��判宁E*�E�根据设定的半身掩体高度�E�Eow Cover�E�妁E`0.9m~1.2m`�E�和全身掩体高度�E�Eull Cover�E�妁E`≥1.8m`�E�，�E动为场景中皁E��体边缘栁E��颜色栁E��E��Ebr>• **两点对封E��E��尺�E�Eoint-to-Point Sightline�E�E*�E�拉线实时检测狙击点与目栁E��之间是否有�E挡�E�并在断面图上直接展示见E��穿迁E��高程轨迹、E|
| **3. 动线、节奏与语义栁E�� (Flow, Pacing & Semantics)** | • **语义白盒材质与栁E��**�E�一键封E��积块栁E��为 `Walkable (可行走地面)`、`Wall (阻挡墁E`、`Cover (掩佁E`、`Hazard (危险区/死亡坁E`、`Trigger/Zone (战斗/解谁E剧惁E��发区)`、`Climbable (可攀爬)`、Ebr>• **主/支线动线绘制与耗时估算！Eath & Timing�E�E*�E�绘制主线�E�Eolden Path�E�、侧翼匁E��路线�E�Elank Route�E�、E��藏捷征E���E动计算路征E��长度、根据跑动速度估算通�E跑图耗时�E�妁E`12.4s`�E�以及高低爬十E��、Ebr>• **兴趣点�E�EOI�E�与刷怪/机关图钁E*�E�放置出生点�E�Epawn�E�、检查点�E�Eheckpoint�E�、Boss/精英怪、�E利品、E��匁E门锁及拓扑连接线�E�Eey-Lock Dependency Graph�E�、E|
| **4. 第一/第三人称实时游走测证E(Instant Playtest Mode)** | • 一键持E`Tab` 或点击 **Playtest** 立即以设定的角色胶囊物琁E��数�E�真实身高、移动速度、E��力、跳跁E��度、爬坡限制�E�进�E关卡第一/第三人称实机漫游�E�并可记录游走轨迹叠加回俯见E��、E|
| **5. 关卡空间质量�E动审计 (Level Audit & Metrics Report)** | • 自动统计可行走面积、掩体寁E��比、平坁E��火距离、E��道最突E��颈宽度、跳跁E��崖间距是否合见E��并输�E结构化报告供设计师�E AI 诊断、E|

---

### 3.3 导出与游戏引擎 / 蓝图对接
- **3D 赁E��导出**�E�E  - **glTF / GLB 导出**�E�保留节点层级、语义命名与材质刁E��E��直接拖�E Unity / Unreal / Godot、E  - **Wavefront OBJ 导出**�E�通用白盒网格格式、E  - **Unity / Unreal 导入辁E��脚本导出**�E�支持导出 JSON 并陁E��一键在 Unity/UE 中还原原生 Cube/Ramp/Trigger 绁E��皁E�E本模板、E- **2D 设计斁E��蓝图导出**�E�E  - 导出高渁E**SVG / PNG 俯见E��面图与断面图**�E�含比例尺、栁E��注释、动线箭头、POI 图例、尺寸栁E��线�E�，可直接贴入策�E案！EDD / PPT / Confluence�E�、E
---

### 3.4 AI-Native 对接架极E��支持EClaude 丁ECodex 谁E��修改�E�E
为亁E�� **Claude Code**、E*Claude Desktop** 咁E**Codex** 能够像赁E��关卡设计师助手一样自由读取和修改关卡�E��E们设计三层栁E��接口�E�E
#### 1) 语义化关卡 JSON DSL (`levels/current.level.json`)
所有�E何体、动线、POI、断面线和角色参数坁E��极度渁E��、人类与大模型皆易读皁EJSON 结构存储�E�带有语乁EID、坐栁E��尺寸、栁E��和注释）！E```json
{
  "version": "1.0.0",
  "metadata": { "name": "Arena_Blockout_01", "gridSize": 1.0 },
  "metricsProfile": {
    "playerHeight": 1.8,
    "playerRadius": 0.4,
    "crouchHeight": 1.0,
    "walkSpeed": 4.5,
    "runSpeed": 7.0,
    "jumpHeight": 1.6,
    "jumpDistance": 5.0,
    "maxSlopeAngle": 45,
    "lowCoverHeight": 1.1,
    "fullCoverHeight": 1.8
  },
  "blocks": [
    {
      "id": "floor_main_plaza",
      "name": "中央广场地面",
      "type": "box",
      "role": "walkable",
      "position": [0, -0.25, 0],
      "size": [24, 0.5, 24],
      "rotation": [0, 0, 0],
      "floor": 0
    }
  ]
}
```

#### 2) 命令行工具 (`npx levelforge` / `npm run ai -- ...`)
专为 Claude Code 咁ECodex 终端执行设计�E�支持单条持E��或批量事务�E�Eatch Operations�E�修改当前正在网页中打开皁E�E卡�E�E- `npm run ai -- status`�E�输�E当前关卡皁E��间摘要、区块�E表、动线耗时与潜在设计问题（如不可达平台、见E��死角）、E- `npm run ai -- add-block --type box --name "北侧高台" --role walkable --pos 0,2,-10 --size 12,4,6`
- `npm run ai -- add-block --type stairs --name "西侧阶梯" --pos -5,0,-6 --size 3,2,4 --rot 0,90,0`
- `npm run ai -- update-block --id <id> ...` / `delete-block --id <id>`
- `npm run ai -- apply-patch --file patch.json`�E�支持EAI 一次性提交复杂皁E��间生�E、掩体群币E��或对称镜像持E��、E- `npm run ai -- analyze-los --from 0,3.6,-10 --to 0,1.6,8`�E�AI 在命令行直接计算两点见E��是否被遮挡及�E挡物 ID、E- `npm run ai -- check-jump --from-block <id1> --to-block <id2>`�E�AI 校验两个白盒平台之间玩家能否跳迁E��E
#### 3) 栁E�� MCP Server (`server/mcp-server.ts`) & 浏览器 API (`window.LevelForgeAI`)
- 提供�E循 Model Context Protocol 皁EMCP 服务端�E�暴露 `get_level_summary`、`list_blocks`、`upsert_blocks`、`delete_blocks`、`generate_room_layout`、`analyze_sightlines`、`validate_jump_metrics`、`set_section_plane` 等工具�E�并提供一键添加到 Claude Code (`claude mcp add levelforge ...`) 咁ECodex (`AGENTS.md` / `CLAUDE.md`) 皁E��整配置与提示词指南、E
---

## 4. 项目目录与文件见E�E

项目封E�E建在 `level-builder` 下！E
### 基础设施丁EAI 服务端 / CLI
#### [NEW] [package.json](package.json)
配置 Vite、Three.js、TypeScript、Express/WebSocket 实时同步桥叁ECLI/MCP 启动脚本、E#### [NEW] [CLAUDE.md](CLAUDE.md) & [AGENTS.md](AGENTS.md)
专为 Claude Code 丁EOpenAI Codex 编�E皁E��作手册与�E卡设计空间见E��说明，让 AI 进�E目录即可自动掌握如何操作�E卡、E#### [NEW] [server/bridge-server.ts](server/bridge-server.ts)
提侁EREST API (`/api/level`, `/api/command`, `/api/analyze`)、WebSocket 广播�E�以及对 `levels/current.level.json` 皁E��向文件监听、E#### [NEW] [server/cli.ts](server/cli.ts)
命令行工具�E�侁EClaude/Codex 通迁Eshell 快速增删改查白盒、批量执衁EDSL 命令、执行跳跁E��见E��空间检测、E#### [NEW] [server/mcp-server.ts](server/mcp-server.ts)
栁E�� JSON-RPC MCP Server�E�侁EClaude Desktop / Claude Code 直接挂载谁E��、E
---

### 核忁E��据模型与空间算法引擎�E�前后端丁EAI 共享�E�E#### [NEW] [src/core/types.ts](src/core/types.ts)
定义白盒图允E��Eox, Ramp, Stairs, Cylinder, Arch�E�、角色度量衡�E�EetricsProfile�E�、动线路征E��ElowPath�E�、�E趣点�E�EOI�E�、见E��锥�E�EisionCone�E�、断面刁E���E�EectionLine�E�及 AI Action 协议、E#### [NEW] [src/core/geometry-analysis.ts](src/core/geometry-analysis.ts)
纯数学/几何�E析引擎�E�Eode.js CLI 与浏览器共用�E�！E- 任意平面 $A\text{--}A'$ 与白盒�E何体的精确断面求交算法！Eross-Section Slicer�E�、E- 2D/3D 封E��遮挡与见E��多边形计算！EOS & Visibility Cone Raycaster�E�、E- 跳跁E��物线轨迹方程、头顶碰撞检测与双平台可达性判定、E- 关卡持E��E�E动审计�E�面积、掩体比、坡度趁E��、净空不足检测）、E#### [NEW] [src/core/store.ts](src/core/store.ts)
支持EUndo/Redo 厁E��栈、命令刁E���E�Eommand Pattern�E�、WebSocket 实时同步丁E`window.LevelForgeAI` 暴露皁E��态管琁E��忁E��E#### [NEW] [src/core/presets.ts](src/core/presets.ts)
冁E��经�E关卡模板�E�例如！E*“双层�E术竞技场与狙击走廊 E*、E*“立体箱庭探索与平台跳跁E��迹 E*�E�以及多种游戏类型的角色参数颁E���E�EPS 战术封E�E、TPS 动作�E险、ED 平台跳跁E��、E
---

### 三见E��渲染与交互工作台�E�Erontend UI & Viewports�E�E#### [NEW] [src/viewports/Viewport3D.ts](src/viewports/Viewport3D.ts)
基亁EThree.js 皁E3D 见E���E�程序化世界坐栁E��E��网格材质�E�Eorld-Space Grid Shader/Texture�E�、TransformControls 交互、�E面实时剖�E颁E��！ED Clipping Plane�E�、ED 跳跁E��物线、ED 见E��锥、角色胶囊参老E��型与第一/第三人称物琁E��游模式！Elaytest Controller�E�、E#### [NEW] [src/viewports/ViewportTop2D.ts](src/viewports/ViewportTop2D.ts)
高精度 2D 俯见E��图见E���E�支持拖拽拉桁E�E建白盒、E��点/边缘拖拽缩放、楼层迁E��、E��程色带、ED 见E��阴影多边形、动线路征E��制、比例尺栁E���E�以及可交互拖拽旋转皁E**$A\text{--}A'$ 断面刁E��手柄**、E#### [NEW] [src/viewports/ViewportSection2D.ts](src/viewports/ViewportSection2D.ts)
实时 2D 断面剖析见E���E�实时渲柁E$A\text{--}A'$ 刁E��下的地形剖面、建筑斜线填允E���E牁E��度远景轮廓、E��程栁E��、人形胶囊尺度对比、断面跳跁E��物线模拟，并支持在断面图中直接选中白盒拖拽谁E��高程与高度、E#### [NEW] [src/exporters/exporters.ts](src/exporters/exporters.ts)
实现 GLTF/GLB、Wavefront OBJ、Unity C# 白盒重建脚本、JSON DSL 以及高渁ESVG/PNG 俯见E��断面蓝图导出、E#### [NEW] [src/main.ts](src/main.ts) & [index.html](index.html)
专业深色工业级 DCC 工具 UI�E�类似 Blender / Unreal / TrenchBroom 风格�E�，集成左侧建模与栁E��工具栏、中央可刁E��刁E��三见E��、右侧属性/度量衡/见E��/关卡审计面板、底部 AI 命令终端与实时同步状态栏、E
---

## 5. 验证计刁E(Verification Plan)

### 自动化与命令行验证E1. **TypeScript 编译与构建测证E*�E�执衁E`npm run build` 验证前端与后端/CLI 零类型错误、E2. **AI CLI 与�E何�E析测证E*�E�E   - 运衁E`npm run ai -- status`、`npm run ai -- add-block ...`、`npm run ai -- check-jump ...`、`npm run ai -- analyze-los ...`�E�验证ECLI 能正确修改 `levels/current.level.json` 并返回凁E��皁E�E何计算与可达性结果、E3. **实时同步服务验证E*�E�启动开发服务�E�测试通迁EREST API 咁ECLI 修改关卡时 WebSocket 广播丁EJSON 持乁E��正常工作、E
### 手动与交互验证E1. 在浏览器中测证E**2D 俯见E��拉桁E�E建白盁E* $\leftrightarrow$ **3D 见E��实时生�E与拖拽** $\leftrightarrow$ **断面图 $A\text{--}A'$ 刁E��实时剖�E与高度谁E��**、E2. 验证E**跳跁E��物线栁E��、见E��遮挡扁E���E�EOS�E�、动线耗时测算、第一人称 Playtest 实机游走** 叁E**OBJ/GLTF/SVG 蓝图导出**、E