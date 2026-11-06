import { ROLE_META } from './geometry-analysis';
import { BlockRole } from './types';

export interface UIThemeConfig {
  id: string;
  nameZh: string;
  nameEn: string;
  nameJa: string;
  bg0: string;
  bg1: string;
  bg2: string;
  bg3: string;
  border: string;
  borderLight: string;
  textMain: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  vp3dBg: string;
  vp2dBg: string;
  roleColors?: Partial<Record<BlockRole, string>>;
}

export const THEME_PRESETS: Record<string, UIThemeConfig> = {
  unity_dark: {
    id: 'unity_dark',
    nameZh: '🎮 Unity Pro 深灰 (Unity Dark)',
    nameEn: '🎮 Unity Pro Dark',
    nameJa: '🎮 Unity Pro ダーク',
    bg0: '#161616',
    bg1: '#222222',
    bg2: '#2d2d2d',
    bg3: '#3c3c3c',
    border: '#141414',
    borderLight: '#3a3a3a',
    textMain: '#e4e4e4',
    textMuted: '#9a9a9a',
    accent: '#4da6ff',
    accentHover: '#2b8ce6',
    vp3dBg: '#191919',
    vp2dBg: '#121212',
  },
  cyber_slate: {
    id: 'cyber_slate',
    nameZh: '🌌 深海科技蓝 (LevelForge Slate)',
    nameEn: '🌌 Cyber Slate (Default)',
    nameJa: '🌌 サイバースレート',
    bg0: '#070b14',
    bg1: '#0f172a',
    bg2: '#1e293b',
    bg3: '#334155',
    border: '#1e293b',
    borderLight: '#334155',
    textMain: '#f8fafc',
    textMuted: '#94a3b8',
    accent: '#38bdf8',
    accentHover: '#0ea5e9',
    vp3dBg: '#0b111e',
    vp2dBg: '#080c15',
  },
  unreal_carbon: {
    id: 'unreal_carbon',
    nameZh: '⚡ UE5 曜石碳黑 (Unreal Carbon)',
    nameEn: '⚡ Unreal 5 Carbon',
    nameJa: '⚡ Unreal 5 カーボン',
    bg0: '#0b0c0e',
    bg1: '#141519',
    bg2: '#1f2128',
    bg3: '#2c2f3a',
    border: '#090a0c',
    borderLight: '#2e323d',
    textMain: '#f3f4f6',
    textMuted: '#8b92a5',
    accent: '#00a8ff',
    accentHover: '#0090db',
    vp3dBg: '#0d0e12',
    vp2dBg: '#090a0d',
  },
  blender_graphite: {
    id: 'blender_graphite',
    nameZh: '🟠 Blender 石墨暖橙 (Graphite)',
    nameEn: '🟠 Blender Graphite',
    nameJa: '🟠 Blender グラファイト',
    bg0: '#181818',
    bg1: '#242424',
    bg2: '#303030',
    bg3: '#404040',
    border: '#151515',
    borderLight: '#3d3d3d',
    textMain: '#ededed',
    textMuted: '#9e9e9e',
    accent: '#ff8c1a',
    accentHover: '#e67300',
    vp3dBg: '#202020',
    vp2dBg: '#161616',
  },
  cad_blueprint: {
    id: 'cad_blueprint',
    nameZh: '📐 工程制图蓝图 (CAD Blueprint)',
    nameEn: '📐 CAD Blueprint',
    nameJa: '📐 CAD ブループリント',
    bg0: '#041222',
    bg1: '#081d36',
    bg2: '#0f2c4f',
    bg3: '#193d68',
    border: '#0a223d',
    borderLight: '#1e497a',
    textMain: '#f0f9ff',
    textMuted: '#7dd3fc',
    accent: '#22d3ee',
    accentHover: '#06b6d4',
    vp3dBg: '#06192e',
    vp2dBg: '#041324',
  },
  daylight_paper: {
    id: 'daylight_paper',
    nameZh: '☀️ 护眼白昼纸张 (Daylight Paper)',
    nameEn: '☀️ Daylight Paper',
    nameJa: '☀️ デイライト・ペーパー',
    bg0: '#e2e8f0',
    bg1: '#f8fafc',
    bg2: '#ffffff',
    bg3: '#cbd5e1',
    border: '#cbd5e1',
    borderLight: '#94a3b8',
    textMain: '#0f172a',
    textMuted: '#475569',
    accent: '#2563eb',
    accentHover: '#1d4ed8',
    vp3dBg: '#dbeafe',
    vp2dBg: '#f1f5f9',
  },
};

const STORAGE_KEY = 'levelforge_ui_theme_v1';

const DEFAULT_ROLE_COLORS: Record<BlockRole, string> = {
  walkable: '#475569',
  one_way_platform: '#14b8a6',
  wall: '#94a3b8',
  cover_low: '#0ea5e9',
  cover_full: '#2563eb',
  climbable: '#eab308',
  hazard: '#ef4444',
  trigger_combat: '#f97316',
  trigger_puzzle: '#a855f7',
  water: '#06b6d4',
  objective: '#10b981',
};

let currentTheme: UIThemeConfig = loadInitialTheme();

function loadInitialTheme(): UIThemeConfig {
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UIThemeConfig;
        if (parsed && parsed.bg0 && parsed.accent) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }
  return structuredClone(THEME_PRESETS.unity_dark);
}

export function getTheme(): UIThemeConfig {
  return currentTheme;
}

export function applyThemeToDOM(theme: UIThemeConfig = currentTheme): void {
  currentTheme = theme;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentTheme));
  }

  // Apply role color overrides into ROLE_META
  (Object.keys(DEFAULT_ROLE_COLORS) as BlockRole[]).forEach((role) => {
    ROLE_META[role].color = theme.roleColors?.[role] || DEFAULT_ROLE_COLORS[role];
  });

  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.style.setProperty('--bg-0', theme.bg0);
    root.style.setProperty('--bg-1', theme.bg1);
    root.style.setProperty('--bg-2', theme.bg2);
    root.style.setProperty('--bg-3', theme.bg3);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--border-light', theme.borderLight);
    root.style.setProperty('--text-main', theme.textMain);
    root.style.setProperty('--text-muted', theme.textMuted);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-hover', theme.accentHover);
    root.style.setProperty('--vp3d-bg', theme.vp3dBg);
    root.style.setProperty('--vp2d-bg', theme.vp2dBg);
  }
}

export function selectPresetTheme(presetId: string): UIThemeConfig {
  const preset = THEME_PRESETS[presetId] || THEME_PRESETS.unity_dark;
  const next: UIThemeConfig = {
    ...structuredClone(preset),
    roleColors: structuredClone(currentTheme.roleColors || {}),
  };
  applyThemeToDOM(next);
  return next;
}

export function resetDefaultRoleColors(): void {
  currentTheme.roleColors = {};
  applyThemeToDOM(currentTheme);
}

export const QUICK_COLOR_SWATCHES = [
  '#475569',
  '#94a3b8',
  '#38bdf8',
  '#2563eb',
  '#10b981',
  '#eab308',
  '#f97316',
  '#ef4444',
  '#a855f7',
  '#ec4899',
  '#14b8a6',
  '#f8fafc',
];
