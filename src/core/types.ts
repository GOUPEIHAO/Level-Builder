export type BlockType = 'box' | 'ramp' | 'stairs' | 'cylinder' | 'arch';

export type GameDimensionMode = '3d' | '2d_side' | '2d_topdown';

export type BlockRole =
  | 'walkable'
  | 'one_way_platform'
  | 'wall'
  | 'cover_low'
  | 'cover_full'
  | 'climbable'
  | 'hazard'
  | 'trigger_combat'
  | 'trigger_puzzle'
  | 'water'
  | 'objective';

export type Vec3 = [number, number, number];
export type Vec2 = [number, number];

export interface LevelBlock {
  id: string;
  name: string;
  type: BlockType;
  role: BlockRole;
  /** Center position [x, y, z] in meters (Y is up) */
  position: Vec3;
  /** Dimensions [width (X), height (Y), depth (Z)] in meters */
  size: Vec3;
  /** Euler rotation [rx, ry, rz] in degrees */
  rotation: Vec3;
  /** Logical floor index (e.g., -1 = basement, 0 = ground, 1 = 2F, 2 = 3F) */
  floor: number;
  /** Optional custom hex color override */
  color?: string;
  /** For stairs: step count; for arch: wall thickness ratio */
  steps?: number;
  /** Quick design intent classification tag (e.g., '视线阻断', '视觉地标', '跳跃校验点') */
  designTag?: string;
  /** Detailed level design intent / gameplay rationale */
  notes?: string;
  /** Interactive mechanics or trigger condition note */
  mechanicsTip?: string;
  /** Optional ID of linked Block or POI (e.g., puzzle trigger -> locked door / moving bridge) */
  linkedId?: string;
  locked?: boolean;
  hidden?: boolean;
}

export type FlowPathType = 'main' | 'flank' | 'secret' | 'patrol' | 'sightline';

export interface FlowPath {
  id: string;
  name: string;
  type: FlowPathType;
  /** Ordered 3D waypoints [x, y, z] */
  points: Vec3[];
  color?: string;
  /** Bidirectional or one-way */
  oneWay?: boolean;
}

export type POICategory =
  | 'spawn_player'
  | 'spawn_enemy'
  | 'sniper_nest'
  | 'boss'
  | 'objective'
  | 'checkpoint'
  | 'loot'
  | 'key'
  | 'locked_door'
  | 'vantage_point'
  | 'note';

export interface EnemyAIConfig {
  /** Patrol mode: stationary, loop (A->B->C->A), or pingpong (A->B->C->B->A) */
  patrolMode: 'stationary' | 'loop' | 'pingpong';
  /** Ordered patrol waypoints [x, y, z] in world space */
  waypoints: Vec3[];
  /** Whether to automatically run A* pathfinding on the walkable nav-grid between waypoints and to the player target */
  autoPathfind: boolean;
  /** Patrol movement speed (m/s) */
  patrolSpeed: number;
  /** Alert / Chase movement speed (m/s) */
  chaseSpeed: number;
  /** 360-degree hearing / proximity detection radius (meters) */
  hearingRange: number;
  /** Target POI or Block ID for enemy target acquisition / pathfinding test (default: player spawn) */
  targetId?: string;
}

export interface LevelPOI {
  id: string;
  name: string;
  category: POICategory;
  position: Vec3;
  /** Yaw angle in degrees (0 = -Z north, 90 = +X east) */
  yaw: number;
  /** Vision cone settings if category has LOS or showVision is enabled */
  showVision: boolean;
  fov: number; // degrees, e.g., 90
  visionRange: number; // meters, e.g., 22
  eyeHeight: number; // meters above position.y, e.g., 1.6
  /** Enemy patrol, A* pathfinding, and aggro/target acquisition settings */
  enemyConfig?: EnemyAIConfig;
  /** Optional ID of linked POI or Block (e.g., key -> locked_door) */
  linkedId?: string;
  /** Quick design intent classification tag */
  designTag?: string;
  /** Detailed level design intent / gameplay rationale */
  notes?: string;
  /** Interactive mechanics or trigger condition note */
  mechanicsTip?: string;
}

export interface JumpLink {
  id: string;
  name: string;
  from: Vec3;
  to: Vec3;
  /** Optional attached object IDs so moving a block moves the jump link endpoints */
  fromId?: string;
  toId?: string;
  /** Optional mode override: 'normal' | 'sprint' | 'double' */
  mode?: 'normal' | 'sprint' | 'double';
}

export interface SightlineLink {
  id: string;
  name: string;
  /** Optional attached source object ID (Block or POI) */
  fromId?: string;
  /** Optional attached target object ID (Block or POI) */
  toId?: string;
  /** Fallback or offset world coordinates [x, y, z] */
  fromPos: Vec3;
  toPos: Vec3;
  /** Height offset above object surface/base (e.g., 1.65m eye height or 1.1m crouch height) */
  fromHeightOffset: number;
  toHeightOffset: number;
}

export interface SectionPlaneConfig {
  /** Start point [x, z] on the horizontal plane */
  start: Vec2;
  /** End point [x, z] on the horizontal plane */
  end: Vec2;
  /** Depth slab behind the cut plane to render as background projection (meters) */
  slabDepth: number;
  /** Whether 3D viewport also clips geometry along this section plane */
  clip3D: boolean;
  /** Flip normal direction */
  flipNormal?: boolean;
}

export type PlayerCameraMode = 'fps' | 'tps' | 'topdown' | 'side_2d';

export interface MetricsProfile {
  presetName: string;
  playerHeight: number;      // e.g. 1.8m
  playerRadius: number;      // e.g. 0.4m
  crouchHeight: number;      // e.g. 1.0m
  eyeHeight: number;         // e.g. 1.65m
  walkSpeed: number;         // e.g. 4.2 m/s
  runSpeed: number;          // e.g. 6.8 m/s
  crouchSpeed: number;       // e.g. 2.4 m/s
  jumpHeight: number;        // e.g. 1.6m
  jumpDistance: number;      // e.g. 4.8m (running jump horizontal span)
  doubleJumpHeight: number;  // e.g. 2.8m
  doubleJumpDistance: number;// e.g. 7.2m
  maxSlopeAngle: number;     // e.g. 45 deg
  maxStepHeight: number;     // e.g. 0.35m
  lowCoverHeight: number;    // e.g. 1.1m
  fullCoverHeight: number;   // e.g. 1.85m
  minCorridorWidth: number;  // e.g. 2.0m (single), 3.5m (combat)
  gravity: number;           // e.g. 18.0 m/s^2

  /** Player Camera Settings (摄像机配置) */
  cameraMode?: PlayerCameraMode;        // 'fps' | 'tps' | 'topdown'
  cameraFov?: number;                   // Vertical/Camera FOV in degrees, e.g. 70
  cameraDistance?: number;              // SpringArm length (m), e.g. 3.2m for TPS, 0m for FPS
  cameraOffsetY?: number;               // Camera pivot height above player base (m), e.g. 1.65m
  cameraShoulderOffset?: number;        // Horizontal over-the-shoulder offset (m), e.g. 0.45m
  cameraPitch?: number;                 // Default camera pitch angle in degrees, e.g. -12
  cameraCollision?: boolean;            // Enable 3D SpringArm obstacle anti-clipping collision
  showPlayerCameraFrustum?: boolean;    // Render 3D/2D/Section camera frustum & boom arm

  /** Player Vision & Perception Settings (玩家视野与感知配置) */
  showPlayerVision?: boolean;           // Render Player 3D floor-aware LOS vision cone
  playerVisionFov?: number;             // Player effective tactical FOV (deg), e.g. 95
  playerVisionRange?: number;           // Player main visual identification range (m), e.g. 26
  playerPeripheralRange?: number;       // Player 360° close-quarters / hearing awareness radius (m), e.g. 5.0
}

export interface LevelMetadata {
  name: string;
  author: string;
  genre: string;
  /** 3D Spatial ('3d') vs 2D Side-Scroller ('2d_side') vs 2D Top-Down ('2d_topdown') */
  dimensionMode?: GameDimensionMode;
  gridSize: number;
  snapRotation: number;
  targetCompletionTimeSec: number;
  description: string;
  updatedAt: string;
}

export interface LevelDocument {
  version: string;
  metadata: LevelMetadata;
  metricsProfile: MetricsProfile;
  sectionPlane: SectionPlaneConfig;
  blocks: LevelBlock[];
  paths: FlowPath[];
  pois: LevelPOI[];
  jumps: JumpLink[];
  sightlines?: SightlineLink[];
}

export type ActiveTool =
  | 'select'
  | 'draw_box'
  | 'draw_ramp'
  | 'draw_stairs'
  | 'draw_cylinder'
  | 'draw_arch'
  | 'draw_path'
  | 'place_poi'
  | 'add_enemy_waypoint'
  | 'measure_jump'
  | 'edit_section'
  | 'measure_ruler';

export type ViewportLayout = 'quad' | 'split_3d_2d' | 'only_3d' | 'only_top' | 'only_section';

export interface JumpEvaluation {
  horizontalDist: number;
  verticalDelta: number;
  requiredApexY: number;
  effectiveMaxDistSingle: number;
  effectiveMaxDistDouble: number;
  maxReachPoint: Vec3;
  capabilityArcPoints: Vec3[];
  arcPoints: Vec3[];
  status: 'safe' | 'stretch' | 'double_jump' | 'impossible' | 'blocked';
  statusLabel: string;
  reason: string;
  blockedPoint?: Vec3;
}

export interface CrossSectionSliceItem {
  block: LevelBlock;
  cutPolygons: Vec2[][];
  slabProjections: [number, number, number, number][];
  slopeAngle?: number;
  warning?: string;
}

export interface AuditIssue {
  severity: 'error' | 'warning' | 'info';
  category: 'metrics' | 'sightline' | 'flow' | 'cover';
  title: string;
  detail: string;
  relatedIds: string[];
}

export interface PacingBeatPoint {
  progressPct: number;
  distanceM: number;
  tension: number; // 0..100 combat/hazard threat intensity
  safety: number;  // 0..100 cover/checkpoint/loot recovery score
  elevation: number;
  beatLabel: string;
}

export interface LevelAuditSummary {
  totalWalkableArea: number;
  totalCoverLength: number;
  coverToAreaRatio: number;
  mainPathDistance: number;
  estimatedWalkTimeSec: number;
  estimatedRunTimeSec: number;
  elevationSpan: [number, number];
  floorBreakdown: Record<number, number>;
  pacingBeats?: PacingBeatPoint[];
  pacingVerdict?: string;
  issues: AuditIssue[];
}

export type AICommandAction =
  | { action: 'add_block'; block: Partial<LevelBlock> & { name?: string; type?: BlockType } }
  | { action: 'update_block'; id: string; patch: Partial<LevelBlock> }
  | { action: 'delete_block'; id: string }
  | { action: 'add_poi'; poi: Partial<LevelPOI> }
  | { action: 'update_poi'; id: string; patch: Partial<LevelPOI> }
  | { action: 'delete_poi'; id: string }
  | { action: 'add_path'; path: Partial<FlowPath> }
  | { action: 'delete_path'; id: string }
  | { action: 'add_jump'; jump: Partial<JumpLink> }
  | { action: 'delete_jump'; id: string }
  | { action: 'add_sightline'; sightline: Partial<SightlineLink> }
  | { action: 'delete_sightline'; id: string }
  | { action: 'set_section'; section: Partial<SectionPlaneConfig> }
  | { action: 'update_metrics'; metrics: Partial<MetricsProfile> }
  | { action: 'generate_room'; center: Vec3; size: Vec3; wallThickness?: number; floor?: number; name?: string; doorways?: ('north' | 'south' | 'east' | 'west')[] }
  | { action: 'scatter_cover'; boundsMin: Vec3; boundsMax: Vec3; count: number; floor?: number }
  | { action: 'mirror_blocks'; axis: 'x' | 'z'; blockIds?: string[] }
  | { action: 'clear_all' };
