# LevelForge (Level Builder) — 项目需求、对话记录与设计归档

- **归档路径**：`E:\AI Project\Level Builder`
- **会话 ID**：`4756fcd4-99b8-4919-b54d-eaebc431e3ce`
- **构建日期**：2026-11-06

---

## 一、需求演进与对话纪要

### 阶段 1：初始需求与专业关卡设计工具规划
- **用户核心诉求**：
  - 作为游戏关卡设计师，需要一个利用网页快速搭建白盒（Greybox / Blockout）关卡的工具。
  - 根据搭建的关卡实时显示 **俯视图（Top-Down View）** 和 **断面图（Cross-Section View）**。
  - 集成专业关卡设计师所需的全套分析工具。
- **对齐的交互与架构细节**：
  1. **核心建模交互**：2D 与 3D 双向联动编辑（既可在 2D 平面拉框，也可在 3D 视口搭建与调整）。
  2. **专业工具箱**：
     - 角色尺度与运动标尺（胶囊人形参照、最大跳跃高度/距离弧线、爬坡角度检测）
     - 视线与掩体分析（LOS 射线/扇形视野锥、高低差掩体判定）
     - 动线与节奏标注（主/支线路径绘制、路程耗时估算、战斗/解谜区域语义着色、兴趣点 POI 标记）
     - 关卡导出与引擎对接（导出 GLB/glTF、OBJ、Unity Editor 一键重建脚本、SVG 矢量蓝图、JSON DSL）
     - **AI Agent 深度对接**：支持 **Claude Code** 和 **OpenAI Codex** 通过 CLI、MCP Server、REST API 或直接修改 `levels/current.level.json` 实时操控关卡。
  3. **适用类型**：通用型 3D 游戏关卡（内置 TPS 战术射击、3D 平台跳跃、FPS 潜行、箱庭魂系预设，支持完全自定义参数）。

---

### 阶段 2：v1.1 交互体验升级与项目归档
- **用户反馈与改进要求**：
  1. **新建场景功能**：新增独立的 `➕ 新建场景 (New Scene)` 菜单（支持「含 24m 基准地面画布」与「纯空白 0 体块场景」以及大纲面板「🗑️ 清空全部」），并修复 Bridge 文件监听防抖，确保新建场景不会被旧缓存覆盖。
  2. **3D 视口直接添加白盒**：在 3D 视口中选中「矩形/斜坡/楼梯/拱门/圆柱」工具时，支持 3D 地面实时半透明预览框，**左键点击或拖拽即可直接在 3D 视口内拉框创建白盒**（同时在左侧面板提供「⚡ 在场景中心立即生成当前白盒」快捷按钮）。
  3. **跳跃抛物线与角色属性实时物理耦合**：
     - 无需重新拉线，修改角色 **奔跑速度 (`runSpeed`)**、**步行速度 (`walkSpeed`)**、**单跳高度 (`jumpHeight`)**、**基准跳跃距离 (`jumpDistance`)**、**二段跳参数** 或 **重力 (`gravity`)** 的滑块时，已拉好的跳跃线在 **3D 视口、2D 俯视图、2D 断面图** 中的**抛物线弧高、最大可达落点圆环 (`maxReachPoint`) 及可达性状态** 均以 60fps 实时动态伸缩变化。
  4. **多语言国际化支持 (i18n)**：顶部栏内置语言切换器（**🌐 简体中文 / English / 日本語**），一键实时切换全界面文案。
  5. **项目与聊天归档**：项目源码、CLI、MCP Server 与会话记录统一归类保存至 `E:\AI Project\Level Builder`。

---

## 二、快速启动与 AI 调用指南

### 1. 启动 Web 工作台与 AI 实时同步桥
在 `E:\AI Project\Level Builder` 目录下运行：
```bash
npm start
```
- **Web 编辑器地址**：http://localhost:5173/
- **本地 AI Bridge API**：http://127.0.0.1:4399

### 2. Claude Code / Codex CLI 常用命令
```bash
# 查看当前关卡概览与自动审计报告
npm run ai -- status

# 在关卡中添加白盒体块
npm run ai -- add-block --name "二层连桥" --type box --role walkable --pos 0,3,-4 --size 8,0.5,3 --floor 1

# 校验两点间跳跃抛物线与可达性
npm run ai -- check-jump --from -8,3,-2 --to -4.5,3,-2

# 校验两点间 3D 视线遮挡 (LOS)
npm run ai -- analyze-los --from 2.5,4.65,-7.8 --to 1.5,1.2,5.5

# 挂载 MCP Server 到 Claude Code
claude mcp add levelforge -- npx tsx "E:/AI Project/Level Builder/server/mcp-server.ts"
```


---

## 6. 第四阶段迭代归档 (v1.2 — 物体绑定视线遮挡、敌人 A* 寻路与巡逻点、窗口自由缩放、Unity 操控手感)
- **物体绑定测距尺与 3D 可行走地面遮挡 (`src/core/geometry-analysis.ts`)**：
  - 新增 `SightlineLink` 与 `resolveSightlineEndpoints`，允许测距尺连接到具体 POI 或体块并随物体移动自动更新。
  - 升级 `computeVisibilityPolygon` 为真实 3D 斜向地面射线检测，使 2F 可行走楼板 (`walkable`) 准确阻挡向下投射的视野锥，消除视野穿透地面的假阳性问题。
- **敌人巡逻点位、A* 自动寻路与索敌系统 (`computeEnemyPathAStar`, `evaluateEnemyDetection`)**：
  - 支持在 2D/3D 视图点击添加或拖拽敌人巡逻点 `W1, W2...`，自动避开墙体/掩体/危险区并识别斜坡与楼梯计算 3D A* 路径，支持实时巡逻推演与视觉+听觉索敌分析。
- **可缩放工作台窗口 (`setupResizablePanes`) & Unity 编辑器手感 (`Viewport3D.ts`)**：
  - 新增左右边栏与三视口十字分隔条拖拽缩放。
  - 实现 Unity 风格 `RMB + WASD/E/Q (+ Shift)` 3D 飞行漫游、`Q/W/E/R` 工具切换、`F` 键聚焦选中物体及右上角 Scene View 方位切换 Gizmo。

- **玩家摄像机与玩家视野系统 (`computePlayerCameraRig`, `evaluatePlayerVisionTargets`)**：
  - 在 `MetricsProfile` 及玩家出生点属性面板中新增 `FPS / TPS / Top-Down` 摄像机配置（FOV、弹簧臂长度、越肩偏移、Pitch 俯仰角、3D 弹簧臂防穿墙碰撞检测）与玩家视野配置（玩家 3D 视野锥角度/距离、360° 近身感知半径）。
  - 在 3D 视口新增右下角 **16:9 玩家摄像机实时画中画 (PiP)** 预览窗口，并在 3D / 2D 俯视 / 2D 断面三视口同步绘制玩家相机视锥体框线与垂直俯仰角视锥，实机测试 (`Tab`) 同步支持第三人称越肩与弹簧臂防穿墙。

- **界面 UI 精修、6 套常规颜色模板与三层自定义颜色系统 (`src/core/theme.ts`)**：
  - 新增 `THEME_PRESETS`（Unity Dark、Cyber Slate、Unreal Carbon、Blender Graphite、CAD Blueprint、Daylight Paper），并支持对 UI 变量、3D/2D 视口底色、全局语义角色色表 (`ROLE_META`) 以及单个/新建白盒体块颜色 (`customColor` + 12 色快捷色板) 进行全自由取色定制与持久化存储。
