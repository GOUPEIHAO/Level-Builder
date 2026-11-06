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
    nameZh: '🎮 Unity Pro 深灰',
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
    nameZh: '🌌 深海科技蓝 (Slate)',
    nameEn: '🌌 Cyber Slate',
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
    nameZh: '⚡ UE5 曜石碳黑',
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
    nameZh: '🟠 Blender 石墨暖橙',
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
  godot_indigo: {
    id: 'godot_indigo',
    nameZh: '🤖 Godot 靛青深空',
    nameEn: '🤖 Godot Indigo',
    nameJa: '🤖 Godot インディゴ',
    bg0: '#141720',
    bg1: '#1d222f',
    bg2: '#262c3d',
    bg3: '#333b52',
    border: '#11141c',
    borderLight: '#363f58',
    textMain: '#e0e6f5',
    textMuted: '#8c99b8',
    accent: '#478cbf',
    accentHover: '#5da6dc',
    vp3dBg: '#181c26',
    vp2dBg: '#12151e',
  },
  catppuccin_mocha: {
    id: 'catppuccin_mocha',
    nameZh: '🟣 Catppuccin 摩卡紫',
    nameEn: '🟣 Catppuccin Mocha',
    nameJa: '🟣 Catppuccin モカ',
    bg0: '#11111b',
    bg1: '#1e1e2e',
    bg2: '#313244',
    bg3: '#45475a',
    border: '#181825',
    borderLight: '#45475a',
    textMain: '#cdd6f4',
    textMuted: '#a6adc8',
    accent: '#cba6f7',
    accentHover: '#b4befe',
    vp3dBg: '#181825',
    vp2dBg: '#11111b',
  },
  nord_frost: {
    id: 'nord_frost',
    nameZh: '❄️ Nord 极地冰蓝',
    nameEn: '❄️ Nord Frost',
    nameJa: '❄️ Nord フロスト',
    bg0: '#242933',
    bg1: '#2e3440',
    bg2: '#3b4252',
    bg3: '#434c5e',
    border: '#20252e',
    borderLight: '#4c566a',
    textMain: '#eceff4',
    textMuted: '#9aa5b8',
    accent: '#88c0d0',
    accentHover: '#81a1c1',
    vp3dBg: '#292e39',
    vp2dBg: '#222630',
  },
  cyberpunk_neon: {
    id: 'cyberpunk_neon',
    nameZh: '🌆 赛博霓虹紫红',
    nameEn: '🌆 Cyberpunk Neon',
    nameJa: '🌆 サイバーパンク・ネオン',
    bg0: '#090414',
    bg1: '#130926',
    bg2: '#221142',
    bg3: '#341a63',
    border: '#1b0d36',
    borderLight: '#4a258c',
    textMain: '#fdf4ff',
    textMuted: '#c084fc',
    accent: '#f43f5e',
    accentHover: '#e11d48',
    vp3dBg: '#0d061c',
    vp2dBg: '#070310',
  },
  forest_pine: {
    id: 'forest_pine',
    nameZh: '🌲 森系护眼暗绿',
    nameEn: '🌲 Forest Pine',
    nameJa: '🌲 フォレスト・パイン',
    bg0: '#0a1410',
    bg1: '#11211b',
    bg2: '#1b3229',
    bg3: '#264539',
    border: '#0d1a15',
    borderLight: '#2d5244',
    textMain: '#ecfdf5',
    textMuted: '#86efac',
    accent: '#10b981',
    accentHover: '#059669',
    vp3dBg: '#0d1914',
    vp2dBg: '#08110d',
  },
  gruvbox_warm: {
    id: 'gruvbox_warm',
    nameZh: '☕ Gruvbox 复古暖棕',
    nameEn: '☕ Gruvbox Warm',
    nameJa: '☕ Gruvbox ウォーム',
    bg0: '#1d2021',
    bg1: '#282828',
    bg2: '#3c3836',
    bg3: '#504945',
    border: '#1b1d1e',
    borderLight: '#504945',
    textMain: '#ebdbb2',
    textMuted: '#a89984',
    accent: '#fe8019',
    accentHover: '#d65d0e',
    vp3dBg: '#222425',
    vp2dBg: '#191b1c',
  },
  monokai_pro: {
    id: 'monokai_pro',
    nameZh: '🎨 Monokai 经典暗黑',
    nameEn: '🎨 Monokai Pro',
    nameJa: '🎨 Monokai プロ',
    bg0: '#19181a',
    bg1: '#221f22',
    bg2: '#2d2a2e',
    bg3: '#403e41',
    border: '#161517',
    borderLight: '#49474a',
    textMain: '#fcfcfa',
    textMuted: '#939293',
    accent: '#ffd866',
    accentHover: '#fc9867',
    vp3dBg: '#1d1b1d',
    vp2dBg: '#151416',
  },
  cad_blueprint: {
    id: 'cad_blueprint',
    nameZh: '📐 工程制图蓝图',
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
  oled_black: {
    id: 'oled_black',
    nameZh: '🖤 OLED 纯黑高对比',
    nameEn: '🖤 OLED Pitch Black',
    nameJa: '🖤 OLED ピッチブラック',
    bg0: '#000000',
    bg1: '#0a0a0c',
    bg2: '#16161a',
    bg3: '#26262e',
    border: '#141418',
    borderLight: '#2e2e38',
    textMain: '#ffffff',
    textMuted: '#a1a1aa',
    accent: '#38bdf8',
    accentHover: '#0284c7',
    vp3dBg: '#050507',
    vp2dBg: '#000000',
  },
  daylight_paper: {
    id: 'daylight_paper',
    nameZh: '☀️ 护眼白昼纸张 (浅色)',
    nameEn: '☀️ Daylight Paper (Light)',
    nameJa: '☀️ デイライト・ペーパー',
    bg0: '#e2e8f0',
    bg1: '#f1f5f9',
    bg2: '#ffffff',
    bg3: '#cbd5e1',
    border: '#cbd5e1',
    borderLight: '#94a3b8',
    textMain: '#0f172a',
    textMuted: '#475569',
    accent: '#0284c7',
    accentHover: '#0369a1',
    vp3dBg: '#cbd5e1',
    vp2dBg: '#e2e8f0',
  },
  warm_parchment: {
    id: 'warm_parchment',
    nameZh: '🏛️ 建筑羊皮暖白 (浅色)',
    nameEn: '🏛️ Warm Parchment (Light)',
    nameJa: '🏛️ ウォーム・パーチメント',
    bg0: '#e6dfd3',
    bg1: '#f4efe6',
    bg2: '#faf7f2',
    bg3: '#d6cbb9',
    border: '#d6cbb9',
    borderLight: '#b8aa95',
    textMain: '#292524',
    textMuted: '#57534e',
    accent: '#d97706',
    accentHover: '#b45309',
    vp3dBg: '#ded6c6',
    vp2dBg: '#ebe4d8',
  },
  swiss_studio: {
    id: 'swiss_studio',
    nameZh: '🧊 极简瑞士浅灰 (浅色)',
    nameEn: '🧊 Swiss Studio (Light)',
    nameJa: '🧊 スイス・スタジオ',
    bg0: '#dcdfe4',
    bg1: '#eceef1',
    bg2: '#f8f9fa',
    bg3: '#c8ccd4',
    border: '#cfd3da',
    borderLight: '#a0a7b4',
    textMain: '#18181b',
    textMuted: '#52525b',
    accent: '#4f46e5',
    accentHover: '#4338ca',
    vp3dBg: '#d4d8df',
    vp2dBg: '#e4e7ec',
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

function getHexLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 0.1;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function isLightTheme(theme: UIThemeConfig = currentTheme): boolean {
  return getHexLuminance(theme.bg1) > 0.55;
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
    const isLight = isLightTheme(theme);
    const accentLum = getHexLuminance(theme.accent);
    root.style.setProperty('color-scheme', isLight ? 'light' : 'dark');
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
    root.style.setProperty('--accent-contrast', accentLum > 0.45 ? '#090d16' : '#ffffff');
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
