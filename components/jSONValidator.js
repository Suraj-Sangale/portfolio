import { useState, useEffect, useRef, useCallback } from "react";

// ── Styles ─────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --jv-bg:          #050709;
    --jv-surface:     #0c0e14;
    --jv-surface2:    #111420;
    --jv-surface3:    #161a28;
    --jv-border:      rgba(255,255,255,0.07);
    --jv-border2:     rgba(255,255,255,0.14);
    --jv-text:        #e2e8f8;
    --jv-text2:       #8b9cbf;
    --jv-accent:      #6366f1;
    --jv-accent2:     #818cf8;
    --jv-accent-g:    #10b981;
    --jv-accent-g2:   #34d399;
    --jv-accent-r:    #ef4444;
    --jv-accent-r2:   #f87171;
    --jv-accent-y:    #f59e0b;
    --jv-accent-p:    #a855f7;
    --jv-syn-key:     #93c5fd;
    --jv-syn-str:     #86efac;
    --jv-syn-num:     #fbbf24;
    --jv-syn-bool:    #fb923c;
    --jv-syn-null:    #f87171;
    --jv-radius:      12px;
    --jv-radius-sm:   8px;
  }

  .jv-root {
    font-family: 'Inter', sans-serif;
    background: var(--jv-bg);
    color: var(--jv-text);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    margin-top: 5rem;
  }

  /* ── animated background mesh ── */
  .jv-bg-mesh {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  .jv-bg-mesh::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
    top: -200px; left: -200px;
    animation: jv-pulse-1 12s ease-in-out infinite alternate;
  }
  .jv-bg-mesh::after {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 70%);
    bottom: -150px; right: -100px;
    animation: jv-pulse-2 15s ease-in-out infinite alternate;
  }
  .jv-bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  @keyframes jv-pulse-1 {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(60px,40px) scale(1.15); }
  }
  @keyframes jv-pulse-2 {
    0%   { transform: translate(0,0) scale(1); }
    100% { transform: translate(-50px,30px) scale(1.1); }
  }

  /* ── hero header ── */
  .jv-hero {
    position: relative; z-index: 1;
    padding: 28px 32px 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
  .jv-hero-left {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .jv-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.25);
    font-size: 11px;
    font-weight: 500;
    color: var(--jv-accent2);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    width: fit-content;
  }
  .jv-hero-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--jv-accent2);
    animation: jv-blink 2s ease-in-out infinite;
  }
  @keyframes jv-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .jv-hero-title {
    font-size: 26px;
    font-weight: 700;
    color: var(--jv-text);
    line-height: 1.2;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .jv-hero-title-icon {
    width: 42px; height: 42px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--jv-accent) 0%, var(--jv-accent-p) 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
    box-shadow: 0 0 24px rgba(99,102,241,0.4);
  }
  .jv-hero-sub {
    font-size: 13px;
    color: var(--jv-text2);
    line-height: 1.5;
  }
  .jv-hero-stats {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 4px;
  }
  .jv-hero-stat {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background: var(--jv-surface2);
    border: 1px solid var(--jv-border);
    border-radius: var(--jv-radius-sm);
    font-size: 12px;
    color: var(--jv-text2);
    font-family: 'JetBrains Mono', monospace;
    font-weight: 400;
    transition: all 0.2s;
  }
  .jv-hero-stat-val {
    color: var(--jv-text);
    font-weight: 500;
  }

  /* ── shortcut chip ── */
  .jv-shortcuts {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-self: flex-end;
    padding-bottom: 4px;
  }
  .jv-shortcut {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--jv-text2);
    font-family: 'JetBrains Mono', monospace;
  }
  .jv-kbd {
    padding: 2px 7px;
    background: var(--jv-surface3);
    border: 1px solid var(--jv-border2);
    border-radius: 5px;
    font-size: 10px;
    color: var(--jv-text);
    box-shadow: 0 1px 0 rgba(255,255,255,0.1);
  }

  /* ── toolbar ── */
  .jv-toolbar {
    position: relative; z-index: 1;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    padding: 14px 32px;
    flex-shrink: 0;
  }
  .jv-tb-group {
    display: flex;
    gap: 4px;
    background: var(--jv-surface);
    border: 1px solid var(--jv-border);
    border-radius: var(--jv-radius-sm);
    padding: 4px;
  }
  .jv-tb-sep { width: 1px; height: 32px; background: var(--jv-border2); margin: 0 4px; }

  .jv-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.04em;
    padding: 7px 14px;
    border-radius: 6px;
    border: none;
    color: var(--jv-text2);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }
  .jv-btn:hover {
    color: var(--jv-text);
    background: rgba(255,255,255,0.06);
  }
  .jv-btn.primary {
    background: linear-gradient(135deg, var(--jv-accent) 0%, var(--jv-accent-p) 100%);
    color: #fff;
    font-weight: 500;
    box-shadow: 0 0 16px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
  }
  .jv-btn.primary:hover {
    box-shadow: 0 0 24px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.2);
    transform: translateY(-1px);
  }
  .jv-btn.danger:hover {
    color: var(--jv-accent-r2);
    background: rgba(239,68,68,0.1);
  }
  .jv-btn-icon { font-size: 13px; }

  .jv-select {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    padding: 7px 10px;
    border-radius: 6px;
    border: none;
    color: var(--jv-text2);
    background: transparent;
    cursor: pointer;
    outline: none;
    transition: all 0.2s;
  }
  .jv-select:hover { color: var(--jv-text); background: rgba(255,255,255,0.06); }
  .jv-select option { background: #111420; }

  /* ── main split area ── */
  .jv-workspace {
    position: relative; z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0 32px 32px;
    min-height: 0;
  }

  .jv-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    flex: 1;
    overflow: hidden;
    min-height: 0;
    height: 100%;
  }

  /* ── pane ── */
  .jv-pane {
    display: flex;
    flex-direction: column;
    background: var(--jv-surface);
    border: 1px solid var(--jv-border);
    border-radius: var(--jv-radius);
    overflow: hidden;
    transition: border-color 0.3s, box-shadow 0.3s;
    box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  }
  .jv-pane:hover { border-color: var(--jv-border2); }
  .jv-pane.valid-glow { border-color: rgba(16,185,129,0.35); box-shadow: 0 0 24px rgba(16,185,129,0.08), 0 4px 24px rgba(0,0,0,0.3); }
  .jv-pane.error-glow { border-color: rgba(239,68,68,0.35); box-shadow: 0 0 24px rgba(239,68,68,0.08), 0 4px 24px rgba(0,0,0,0.3); }

  .jv-pane-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--jv-border);
    background: rgba(255,255,255,0.02);
    flex-shrink: 0;
    gap: 10px;
  }
  .jv-pane-title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .jv-pane-title-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--jv-border2);
    transition: background 0.3s, box-shadow 0.3s;
  }
  .jv-pane-title-dot.valid { background: var(--jv-accent-g); box-shadow: 0 0 8px var(--jv-accent-g); }
  .jv-pane-title-dot.error { background: var(--jv-accent-r); box-shadow: 0 0 8px var(--jv-accent-r); animation: jv-blink 1s ease-in-out infinite; }
  .jv-pane-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--jv-text2);
  }
  .jv-pane-actions {
    display: flex;
    gap: 4px;
  }
  .jv-pane-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    padding: 5px 12px;
    border-radius: 6px;
    border: 1px solid var(--jv-border);
    color: var(--jv-text2);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.03em;
  }
  .jv-pane-btn:hover {
    color: var(--jv-text);
    border-color: var(--jv-border2);
    background: rgba(255,255,255,0.05);
  }

  /* ── editor ── */
  .jv-editor-wrap {
    position: relative;
    flex: 1;
    overflow: hidden;
    display: flex;
    min-height: 0;
  }
  .jv-line-nums {
    padding: 16px 10px 16px 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    line-height: 1.65;
    color: rgba(139,156,191,0.4);
    text-align: right;
    user-select: none;
    flex-shrink: 0;
    overflow: hidden;
    border-right: 1px solid var(--jv-border);
    background: rgba(0,0,0,0.15);
    min-width: 48px;
    white-space: pre;
  }
  .jv-textarea {
    flex: 1;
    padding: 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    line-height: 1.65;
    color: var(--jv-text);
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    tab-size: 2;
    overflow-y: auto;
  }
  .jv-textarea::placeholder {
    color: rgba(139,156,191,0.3);
  }

  /* ── error panel ── */
  .jv-error {
    margin: 12px 16px 0;
    padding: 12px 16px;
    border-radius: var(--jv-radius-sm);
    background: rgba(239,68,68,0.07);
    border: 1px solid rgba(239,68,68,0.2);
    flex-shrink: 0;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    animation: jv-slide-in 0.2s ease;
  }
  @keyframes jv-slide-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .jv-error-icon { font-size: 14px; margin-top: 1px; flex-shrink: 0; }
  .jv-error-body { flex: 1; }
  .jv-error-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--jv-accent-r2);
    margin-bottom: 3px;
    font-family: 'JetBrains Mono', monospace;
  }
  .jv-error-msg {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: rgba(248,113,113,0.8);
    line-height: 1.5;
  }

  /* ── output ── */
  .jv-output {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    line-height: 1.65;
    min-height: 0;
  }
  .jv-output pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* ── syntax highlight ── */
  .syn-key  { color: var(--jv-syn-key); }
  .syn-str  { color: var(--jv-syn-str); }
  .syn-num  { color: var(--jv-syn-num); }
  .syn-bool { color: var(--jv-syn-bool); }
  .syn-null { color: var(--jv-syn-null); }

  /* ── tabs ── */
  .jv-tabs {
    display: flex;
    border-bottom: 1px solid var(--jv-border);
    flex-shrink: 0;
    padding: 0 4px;
    gap: 2px;
  }
  .jv-tab {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 11px 16px 10px;
    cursor: pointer;
    color: var(--jv-text2);
    border: none;
    background: transparent;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
    border-radius: 6px 6px 0 0;
  }
  .jv-tab:hover { color: var(--jv-text); background: rgba(255,255,255,0.03); }
  .jv-tab.active { color: var(--jv-accent2); border-bottom-color: var(--jv-accent); }

  /* ── search bar ── */
  .jv-search {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 10px 16px 4px;
    padding: 8px 12px;
    background: var(--jv-surface2);
    border: 1px solid var(--jv-border);
    border-radius: var(--jv-radius-sm);
    flex-shrink: 0;
    transition: border-color 0.2s;
  }
  .jv-search:focus-within { border-color: var(--jv-accent); }
  .jv-search-icon { color: var(--jv-text2); font-size: 13px; }
  .jv-search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--jv-text);
  }
  .jv-search-input::placeholder { color: rgba(139,156,191,0.4); }
  .jv-search-count {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--jv-accent2);
    background: rgba(99,102,241,0.15);
    padding: 2px 8px;
    border-radius: 99px;
  }

  /* ── path bar ── */
  .jv-path {
    padding: 6px 16px;
    min-height: 30px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--jv-text2);
    border-bottom: 1px solid var(--jv-border);
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
    flex-shrink: 0;
    background: rgba(0,0,0,0.1);
  }
  .jv-path-seg { color: var(--jv-accent2); cursor: pointer; transition: color 0.15s; }
  .jv-path-seg:hover { color: var(--jv-text); text-decoration: underline; }
  .jv-path-arrow { color: var(--jv-border2); }

  /* ── tree ── */
  .jv-tree-node { padding-left: 18px; }
  .jv-tree-row {
    display: flex;
    align-items: flex-start;
    gap: 4px;
    cursor: pointer;
    border-radius: 5px;
    padding: 2px 5px;
    transition: background 0.12s;
  }
  .jv-tree-row:hover { background: rgba(255,255,255,0.04); }
  .jv-tree-toggle {
    width: 14px; height: 14px;
    flex-shrink: 0;
    margin-top: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--jv-text2);
    font-size: 9px;
    transition: transform 0.18s;
  }
  .jv-tree-toggle.open { transform: rotate(90deg); }
  .jv-tree-children {
    border-left: 1px solid rgba(255,255,255,0.07);
    margin-left: 6px;
  }

  /* ── type badges ── */
  .tb {
    font-size: 9px;
    padding: 1px 6px;
    border-radius: 4px;
    margin-left: 6px;
    margin-top: 2px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.04em;
    font-weight: 500;
  }
  .tb-obj  { background: rgba(99,102,241,0.15);  color: var(--jv-accent2);   border: 1px solid rgba(99,102,241,0.2); }
  .tb-arr  { background: rgba(16,185,129,0.12);   color: var(--jv-accent-g2); border: 1px solid rgba(16,185,129,0.2); }
  .tb-str  { background: rgba(134,239,172,0.08);  color: var(--jv-syn-str);   border: 1px solid rgba(134,239,172,0.15); }
  .tb-num  { background: rgba(251,191,36,0.08);   color: var(--jv-syn-num);   border: 1px solid rgba(251,191,36,0.15); }
  .tb-bool { background: rgba(251,146,60,0.08);   color: var(--jv-syn-bool);  border: 1px solid rgba(251,146,60,0.15); }
  .tb-null { background: rgba(248,113,113,0.08);  color: var(--jv-syn-null);  border: 1px solid rgba(248,113,113,0.15); }

  /* ── diff ── */
  .jv-diff-header {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--jv-text2);
    margin-bottom: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .jv-diff-header::before, .jv-diff-header::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--jv-border);
  }
  .jv-diff-line { display: flex; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.65; white-space: pre-wrap; word-break: break-word; border-radius: 3px; padding: 0 4px; }
  .jv-diff-add  { background: rgba(16,185,129,0.07); color: var(--jv-accent-g2); }
  .jv-diff-rem  { background: rgba(239,68,68,0.07);  color: var(--jv-accent-r2); }
  .jv-diff-ctx  { color: rgba(139,156,191,0.5); }
  .jv-diff-sym  { width: 12px; flex-shrink: 0; opacity: 0.7; }

  /* ── status bar ── */
  .jv-statusbar {
    position: relative; z-index: 1;
    display: flex;
    align-items: center;
    gap: 0;
    padding: 0 32px;
    border-top: 1px solid var(--jv-border);
    background: var(--jv-surface);
    flex-shrink: 0;
    height: 36px;
    overflow-x: auto;
  }
  .jv-status-item {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0 16px;
    height: 100%;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--jv-text2);
    border-right: 1px solid var(--jv-border);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .jv-status-item:first-child { padding-left: 0; }
  .jv-status-item:last-child  { border-right: none; }
  .jv-status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .jv-status-valid   { color: var(--jv-accent-g2); }
  .jv-status-invalid { color: var(--jv-accent-r2); }
  .jv-status-idle    { color: var(--jv-text2); }
  .jv-status-label { color: var(--jv-text2); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; }
  .jv-status-val   { color: var(--jv-text); font-weight: 500; }
  .jv-statusbar-spacer { flex: 1; }

  /* ── empty state ── */
  .jv-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--jv-text2);
    text-align: center;
    padding: 40px 32px;
  }
  .jv-empty-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: var(--jv-surface2);
    border: 1px solid var(--jv-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    opacity: 0.6;
  }
  .jv-empty-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--jv-text);
    opacity: 0.5;
  }
  .jv-empty-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    line-height: 1.6;
    max-width: 260px;
    color: var(--jv-text2);
    opacity: 0.6;
  }

  /* ── drop hint ── */
  .jv-drop-hint {
    padding: 8px 16px;
    margin: 0 16px 8px;
    border-radius: var(--jv-radius-sm);
    border: 1px dashed rgba(99,102,241,0.3);
    background: rgba(99,102,241,0.04);
    font-size: 11px;
    color: var(--jv-text2);
    text-align: center;
    font-family: 'JetBrains Mono', monospace;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  /* ── toast ── */
  .jv-toast {
    position: fixed;
    bottom: 28px; right: 28px;
    z-index: 9999;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    padding: 12px 20px;
    border-radius: var(--jv-radius);
    background: var(--jv-surface2);
    border: 1px solid var(--jv-border2);
    color: var(--jv-text);
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateY(80px) scale(0.96);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    pointer-events: none;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    backdrop-filter: blur(12px);
  }
  .jv-toast.show {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  .jv-toast-icon {
    width: 24px; height: 24px;
    border-radius: 6px;
    background: rgba(99,102,241,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    flex-shrink: 0;
  }

  /* ── scrollbars ── */
  .jv-root ::-webkit-scrollbar { width: 5px; height: 5px; }
  .jv-root ::-webkit-scrollbar-track { background: transparent; }
  .jv-root ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
  .jv-root ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }

  /* ── responsive ── */
  @media (max-width: 900px) {
    .jv-hero { padding: 20px 20px 0; }
    .jv-toolbar { padding: 10px 20px; }
    .jv-workspace { padding: 0 20px 20px; }
    .jv-statusbar { padding: 0 20px; }
    .jv-split { grid-template-columns: 1fr; grid-template-rows: 50vh 50vh; }
    .jv-shortcuts { display: none; }
  }
  @media (max-width: 600px) {
    .jv-hero-stats { gap: 8px; }
    .jv-hero-stat  { padding: 5px 10px; }
    .jv-tb-sep     { display: none; }
  }
`;

// ── Helpers ────────────────────────────────────────────────────────────────
const SAMPLE = {
  name: "Micro Tools",
  version: "1.0.0",
  author: {
    name: "Your Name",
    email: "you@example.com",
    portfolio: "https://yoursite.dev",
  },
  tools: [
    { id: 1, name: "JSON Validator", tags: ["data", "dev"], featured: true },
    { id: 2, name: "Location Tracker", tags: ["location"], featured: false },
    {
      id: 3,
      name: "Color Converter",
      tags: ["dev", "design"],
      featured: false,
    },
  ],
  stats: { totalTools: 8, signupsRequired: 0, freeForever: true },
  meta: { createdAt: 1742648400, lastUpdated: "2025-03-22", license: "MIT" },
};

function fmtBytes(n) {
  if (n < 1024) return n + " B";
  if (n < 1048576) return (n / 1024).toFixed(1) + " KB";
  return (n / 1048576).toFixed(2) + " MB";
}

function countKeys(obj) {
  if (typeof obj !== "object" || obj === null) return 0;
  let c = Array.isArray(obj) ? 0 : Object.keys(obj).length;
  const vals = Array.isArray(obj) ? obj : Object.values(obj);
  vals.forEach((v) => {
    c += countKeys(v);
  });
  return c;
}

function maxDepth(obj, d = 0) {
  if (typeof obj !== "object" || obj === null) return d;
  const vals = Array.isArray(obj) ? obj : Object.values(obj);
  if (!vals.length) return d + 1;
  return Math.max(...vals.map((v) => maxDepth(v, d + 1)));
}

function syntaxHL(json) {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) return `<span class="syn-key">${match}</span>`;
        return `<span class="syn-str">${match}</span>`;
      }
      if (/true|false/.test(match))
        return `<span class="syn-bool">${match}</span>`;
      if (/null/.test(match)) return `<span class="syn-null">${match}</span>`;
      return `<span class="syn-num">${match}</span>`;
    },
  );
}

function getIndentValue(indent) {
  return indent === "tab" ? "\t" : parseInt(indent);
}

// ── Tree View ──────────────────────────────────────────────────────────────
function TreeLeaf({ keyName, value }) {
  const type = typeof value;
  let valEl;
  if (value === null)
    valEl = (
      <>
        <span className="syn-null">null</span>
        <span className="tb tb-null">null</span>
      </>
    );
  else if (type === "boolean")
    valEl = (
      <>
        <span className="syn-bool">{String(value)}</span>
        <span className="tb tb-bool">bool</span>
      </>
    );
  else if (type === "number")
    valEl = (
      <>
        <span className="syn-num">{value}</span>
        <span className="tb tb-num">num</span>
      </>
    );
  else {
    const display =
      String(value).length > 80
        ? String(value).slice(0, 80) + "…"
        : String(value);
    valEl = (
      <>
        <span className="syn-str">"{display}"</span>
        <span className="tb tb-str">str</span>
      </>
    );
  }
  return (
    <div
      className="jv-tree-row"
      style={{ alignItems: "center" }}
    >
      <div
        className="jv-tree-toggle"
        style={{ color: "transparent" }}
      >
        ▶
      </div>
      {keyName !== null && (
        <>
          <span className="syn-key">"{keyName}"</span>
          <span style={{ color: "var(--muted)", margin: "0 4px" }}>:</span>
        </>
      )}
      {valEl}
    </div>
  );
}

function TreeNode({ keyName, data, searchQuery }) {
  const [collapsed, setCollapsed] = useState(false);
  const isArr = Array.isArray(data);
  const isObj = typeof data === "object" && data !== null && !isArr;

  if (!isArr && !isObj) {
    return (
      <TreeLeaf
        keyName={keyName}
        value={data}
      />
    );
  }

  const entries = isArr ? data.map((v, i) => [i, v]) : Object.entries(data);
  const count = entries.length;
  const badge = isArr ? (
    <span className="tb tb-arr">[{count}]</span>
  ) : (
    <span className="tb tb-obj">&#123;{count}&#125;</span>
  );

  return (
    <div>
      <div
        className="jv-tree-row"
        onClick={() => setCollapsed((c) => !c)}
      >
        <div className={`jv-tree-toggle${collapsed ? "" : " open"}`}>▶</div>
        {keyName !== null && (
          <>
            <span className="syn-key">"{keyName}"</span>
            <span style={{ color: "var(--muted)", margin: "0 4px" }}>:</span>
          </>
        )}
        {badge}
      </div>
      {!collapsed && (
        <div className="jv-tree-children">
          {entries.map(([k, v]) => (
            <div
              key={k}
              className="jv-tree-node"
            >
              <TreeNode
                keyName={k}
                data={v}
                searchQuery={searchQuery}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Diff View ──────────────────────────────────────────────────────────────
function DiffView({ original, formatted }) {
  if (!formatted) {
    return (
      <div className="jv-empty">
        <div className="jv-empty-icon">±</div>
        <div className="jv-empty-title">Diff view</div>
        <div className="jv-empty-sub">
          Shows changes between your raw input and the formatted output.
        </div>
      </div>
    );
  }
  const a = original.split("\n");
  const b = formatted.split("\n");
  const lines = [];
  const maxLen = Math.max(a.length, b.length);
  for (let i = 0; i < maxLen; i++) {
    const la = a[i],
      lb = b[i];
    if (la === undefined) lines.push({ type: "add", text: lb });
    else if (lb === undefined) lines.push({ type: "rem", text: la });
    else if (la !== lb) {
      lines.push({ type: "rem", text: la });
      lines.push({ type: "add", text: lb });
    } else lines.push({ type: "ctx", text: la });
  }
  return (
    <div className="jv-output">
      <div
        style={{
          fontFamily: "'DM Mono',monospace",
          fontSize: 11,
          color: "var(--muted)",
          marginBottom: 12,
          letterSpacing: ".08em",
          textTransform: "uppercase",
        }}
      >
        Raw input vs. formatted output
      </div>
      {lines.map((l, i) => (
        <div
          key={i}
          className={`jv-diff-line jv-diff-${l.type}`}
        >
          <span className="jv-diff-sym">
            {l.type === "add" ? "+" : l.type === "rem" ? "-" : " "}
          </span>
          <span>{l.text}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function JSONValidator({ onBack }) {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState("2");
  const [activeTab, setActiveTab] = useState("formatted");
  const [parsedData, setParsedData] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPath, setCurrentPath] = useState("root");
  const [toast, setToast] = useState({ msg: "", icon: "✓", show: false });
  const [stats, setStats] = useState({ bytes: 0, lines: 1, keys: 0, depth: 0 });

  const textareaRef = useRef(null);
  const lineNumsRef = useRef(null);
  const debounceRef = useRef(null);
  const fileInputRef = useRef(null);
  const toastTimer = useRef(null);

  // ── Toast ──────────────────────────────────────────────────────────────
  const showToast = useCallback((msg, icon = "✓") => {
    setToast({ msg, icon, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      2200,
    );
  }, []);

  // ── Parse & update ────────────────────────────────────────────────────
  const updateStats = useCallback((raw, parsed) => {
    const bytes = new Blob([raw]).size;
    const lines = raw ? raw.split("\n").length : 1;
    const keys = parsed ? countKeys(parsed) : 0;
    const depth = parsed ? maxDepth(parsed) : 0;
    setStats({ bytes, lines, keys, depth });
  }, []);

  const tryParse = useCallback(
    (raw) => {
      try {
        const data = JSON.parse(raw);
        setParsedData(data);
        setParseError(null);
        updateStats(raw, data);
        return data;
      } catch (e) {
        setParsedData(null);
        setParseError(e.message);
        updateStats(raw, null);
        return null;
      }
    },
    [updateStats],
  );

  // ── Debounced live validation ─────────────────────────────────────────
  const handleInput = useCallback(
    (val) => {
      setInput(val);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (val.trim()) tryParse(val.trim());
        else {
          setParsedData(null);
          setParseError(null);
          updateStats("", null);
        }
      }, 350);
    },
    [tryParse, updateStats],
  );

  // ── Line numbers sync ─────────────────────────────────────────────────
  const handleScroll = () => {
    if (lineNumsRef.current && textareaRef.current) {
      lineNumsRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lineCount = input.split("\n").length;
  const lineNums = Array.from({ length: lineCount }, (_, i) => i + 1).join(
    "\n",
  );

  // ── Keyboard shortcuts ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "F") {
        e.preventDefault();
        formatJSON();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "M") {
        e.preventDefault();
        minifyJSON();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        downloadJSON();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // ── Drag & drop ───────────────────────────────────────────────────────
  useEffect(() => {
    const onDragOver = (e) => e.preventDefault();
    const onDrop = (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target.result;
        setInput(text);
        tryParse(text.trim());
        showToast(`Dropped ${file.name}`);
      };
      reader.readAsText(file);
    };
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
    };
  }, [tryParse, showToast]);

  // ── Tab key in textarea ───────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current;
      const s = ta.selectionStart,
        end = ta.selectionEnd;
      const newVal = input.substring(0, s) + "  " + input.substring(end);
      setInput(newVal);
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = s + 2;
      }, 0);
    }
  };

  // ── Actions ───────────────────────────────────────────────────────────
  const getFormatted = useCallback(() => {
    if (!parsedData) return null;
    return JSON.stringify(parsedData, null, getIndentValue(indent));
  }, [parsedData, indent]);

  function formatJSON() {
    const raw = input.trim();
    if (!raw) return;
    const data = tryParse(raw);
    if (data !== null) {
      const formatted = JSON.stringify(data, null, getIndentValue(indent));
      setInput(formatted);
      showToast("Formatted!");
    }
  }

  function minifyJSON() {
    const raw = input.trim();
    if (!raw) return;
    const data = tryParse(raw);
    if (data === null) {
      showToast("Cannot minify: invalid JSON", "✕");
      return;
    }
    setInput(JSON.stringify(data));
    setActiveTab("minified");
    showToast("Minified!");
  }

  function sortKeys() {
    const raw = input.trim();
    if (!raw) return;
    const data = tryParse(raw);
    if (data === null) {
      showToast("Cannot sort: invalid JSON", "✕");
      return;
    }
    function sortObj(o) {
      if (Array.isArray(o)) return o.map(sortObj);
      if (typeof o === "object" && o !== null)
        return Object.fromEntries(
          Object.keys(o)
            .sort()
            .map((k) => [k, sortObj(o[k])]),
        );
      return o;
    }
    const sorted = sortObj(data);
    const formatted = JSON.stringify(sorted, null, getIndentValue(indent));
    setInput(formatted);
    tryParse(formatted);
    showToast("Keys sorted alphabetically!");
  }

  function removeComments() {
    let raw = input;
    raw = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "");
    setInput(raw);
    tryParse(raw.trim());
    showToast("Comments stripped!");
  }

  function fixJSON() {
    let raw = input.trim();
    if (!raw) return;
    raw = raw.replace(/,\s*([}\]])/g, "$1");
    raw = raw.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');
    raw = raw.replace(/'/g, '"');
    raw = raw.replace(/:\s*'([^']*)'/g, ': "$1"');
    setInput(raw);
    tryParse(raw.trim());
    showToast("Attempted JSON repair!", "⚙");
  }

  async function copyOutput() {
    if (!parsedData) {
      showToast("Nothing to copy", "✕");
      return;
    }
    const text =
      activeTab === "minified"
        ? JSON.stringify(parsedData)
        : JSON.stringify(parsedData, null, getIndentValue(indent));
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!");
  }

  function downloadJSON() {
    if (!parsedData) {
      showToast("Nothing to download", "✕");
      return;
    }
    const text = JSON.stringify(parsedData, null, getIndentValue(indent));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([text], { type: "application/json" }),
    );
    a.download = "formatted.json";
    a.click();
    showToast("Downloaded!", "↓");
  }

  function clearAll() {
    setInput("");
    setParsedData(null);
    setParseError(null);
    setStats({ bytes: 0, lines: 1, keys: 0, depth: 0 });
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      tryParse(text.trim());
    } catch {
      showToast("Clipboard access denied", "✕");
    }
  }

  function loadFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      setInput(text);
      tryParse(text.trim());
      showToast(`Loaded ${file.name}`);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function loadSample() {
    const text = JSON.stringify(SAMPLE, null, 2);
    setInput(text);
    tryParse(text);
    showToast("Sample loaded!", "★");
  }


  // ── Derived values ────────────────────────────────────────────────────
  const formatted = getFormatted();
  const minified = parsedData ? JSON.stringify(parsedData) : null;
  const isValid = parsedData !== null;
  const hasInput = input.trim().length > 0;

  // ── Pane glow class ───────────────────────────────────────────────────
  const inputPaneClass = `jv-pane${hasInput && isValid ? " valid-glow" : hasInput && parseError ? " error-glow" : ""}`;

  // ── Status element ────────────────────────────────────────────────────
  let statusContent;
  if (!hasInput) {
    statusContent = <span className="jv-status-idle">Ready — paste JSON to begin</span>;
  } else if (isValid) {
    statusContent = (
      <span className="jv-status-valid" style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div className="jv-status-dot" style={{ background: "var(--jv-accent-g)", boxShadow: "0 0 6px var(--jv-accent-g)" }} />
        Valid JSON
      </span>
    );
  } else {
    statusContent = (
      <span className="jv-status-invalid" style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <div className="jv-status-dot" style={{ background: "var(--jv-accent-r)" }} />
        {parseError}
      </span>
    );
  }

  // ── Tab config ────────────────────────────────────────────────────────
  const tabs = [
    { id: "formatted", label: "Formatted", icon: "{ }" },
    { id: "tree",      label: "Tree",      icon: "🌿" },
    { id: "minified",  label: "Minified",  icon: "⊟" },
    { id: "diff",      label: "Diff",      icon: "±" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="jv-root">

        {/* animated background */}
        <div className="jv-bg-mesh">
          <div className="jv-bg-grid" />
        </div>

        {/* hero header */}
        <div className="jv-hero">
          <div className="jv-hero-left">
            <div className="jv-hero-badge">
              <div className="jv-hero-badge-dot" />
              Developer Tool
            </div>
            <div className="jv-hero-title">
              <div className="jv-hero-title-icon">{"{ }"}</div>
              JSON Validator
            </div>
            <div className="jv-hero-sub">
              Format, validate, minify and explore JSON — fast and offline.
            </div>
            <div className="jv-hero-stats">
              <div className="jv-hero-stat">
                <span className="jv-status-label">Size</span>
                <span className="jv-status-val">{fmtBytes(stats.bytes)}</span>
              </div>
              <div className="jv-hero-stat">
                <span className="jv-status-label">Lines</span>
                <span className="jv-status-val">{stats.lines}</span>
              </div>
              <div className="jv-hero-stat">
                <span className="jv-status-label">Keys</span>
                <span className="jv-status-val">{hasInput && isValid ? stats.keys : "—"}</span>
              </div>
              <div className="jv-hero-stat">
                <span className="jv-status-label">Depth</span>
                <span className="jv-status-val">{hasInput && isValid ? stats.depth : "—"}</span>
              </div>
            </div>
          </div>
          <div className="jv-shortcuts">
            <div className="jv-shortcut">
              <span className="jv-kbd">Ctrl</span>
              <span>+</span>
              <span className="jv-kbd">Shift</span>
              <span>+</span>
              <span className="jv-kbd">F</span>
              <span style={{ marginLeft: 4, fontSize: 10 }}>Format</span>
            </div>
            <div className="jv-shortcut">
              <span className="jv-kbd">Ctrl</span>
              <span>+</span>
              <span className="jv-kbd">S</span>
              <span style={{ marginLeft: 4, fontSize: 10 }}>Save</span>
            </div>
          </div>
        </div>

        {/* toolbar */}
        <div className="jv-toolbar">
          <div className="jv-tb-group">
            <button className="jv-btn primary" onClick={formatJSON}>
              <span className="jv-btn-icon">✦</span> Format
            </button>
            <button className="jv-btn" onClick={minifyJSON}>
              <span className="jv-btn-icon">⊟</span> Minify
            </button>
          </div>

          <div className="jv-tb-sep" />

          <div className="jv-tb-group">
            <select
              className="jv-select"
              value={indent}
              onChange={(e) => setIndent(e.target.value)}
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="tab">Tabs</option>
            </select>
          </div>

          <div className="jv-tb-sep" />

          <div className="jv-tb-group">
            <button className="jv-btn" onClick={sortKeys}>
              <span className="jv-btn-icon">↕</span> Sort Keys
            </button>
            <button className="jv-btn" onClick={removeComments}>
              <span className="jv-btn-icon">⌫</span> Strip Comments
            </button>
            <button className="jv-btn" onClick={fixJSON}>
              <span className="jv-btn-icon">⚙</span> Fix &amp; Repair
            </button>
          </div>

          <div className="jv-tb-sep" />

          <div className="jv-tb-group">
            <button className="jv-btn" onClick={copyOutput}>
              <span className="jv-btn-icon">⎘</span> Copy
            </button>
            <button className="jv-btn" onClick={downloadJSON}>
              <span className="jv-btn-icon">↓</span> Download
            </button>
            <button className="jv-btn danger" onClick={clearAll}>
              <span className="jv-btn-icon">✕</span> Clear
            </button>
          </div>

          <div className="jv-tb-sep" />

          <div className="jv-tb-group">
            <button className="jv-btn" onClick={loadSample}>
              <span className="jv-btn-icon">★</span> Sample
            </button>
            <button className="jv-btn" onClick={() => fileInputRef.current.click()}>
              <span className="jv-btn-icon">↑</span> Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.txt"
              style={{ display: "none" }}
              onChange={loadFile}
            />
          </div>
        </div>

        {/* workspace */}
        <div className="jv-workspace">
          <div className="jv-split">

            {/* LEFT — input */}
            <div className={inputPaneClass}>
              <div className="jv-pane-header">
                <div className="jv-pane-title-wrap">
                  <div
                    className={`jv-pane-title-dot${
                      hasInput && isValid ? " valid" : hasInput && parseError ? " error" : ""
                    }`}
                  />
                  <span className="jv-pane-title">Input</span>
                </div>
                <div className="jv-pane-actions">
                  <button className="jv-pane-btn" onClick={pasteFromClipboard}>
                    ⎘ Paste
                  </button>
                  <button className="jv-pane-btn" onClick={() => setInput("")}>
                    ✕ Clear
                  </button>
                </div>
              </div>

              {parseError && hasInput && (
                <div className="jv-error">
                  <div className="jv-error-icon">⚠</div>
                  <div className="jv-error-body">
                    <div className="jv-error-title">Syntax Error</div>
                    <div className="jv-error-msg">{parseError}</div>
                  </div>
                </div>
              )}

              {!hasInput && (
                <div className="jv-drop-hint">
                  <span>📂</span> Drop a .json file here or paste below
                </div>
              )}

              <div className="jv-editor-wrap">
                <div className="jv-line-nums" ref={lineNumsRef}>
                  {lineNums}
                </div>
                <textarea
                  ref={textareaRef}
                  className="jv-textarea"
                  value={input}
                  onChange={(e) => handleInput(e.target.value)}
                  onScroll={handleScroll}
                  onKeyDown={handleKeyDown}
                  placeholder={`Paste your JSON here…\n\n{\n  "name": "Micro Tools",\n  "version": 1\n}`}
                  spellCheck={false}
                />
              </div>
            </div>

            {/* RIGHT — output */}
            <div className="jv-pane">
              <div className="jv-pane-header">
                <div className="jv-pane-title-wrap">
                  <div className="jv-pane-title-dot" style={{ background: "var(--jv-accent)", boxShadow: "0 0 6px var(--jv-accent)" }} />
                  <span className="jv-pane-title">Output</span>
                </div>
                <div className="jv-pane-actions">
                  <button className="jv-pane-btn" onClick={copyOutput}>⎘ Copy</button>
                  <button className="jv-pane-btn" onClick={downloadJSON}>↓ Download</button>
                </div>
              </div>

              {/* tabs */}
              <div className="jv-tabs">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    className={`jv-tab${activeTab === t.id ? " active" : ""}`}
                    onClick={() => setActiveTab(t.id)}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {/* search (tree only) */}
              {activeTab === "tree" && (
                <div className="jv-search">
                  <span className="jv-search-icon">⌕</span>
                  <input
                    className="jv-search-input"
                    placeholder="Search keys or values…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && <span className="jv-search-count">searching…</span>}
                </div>
              )}

              {/* path breadcrumb (tree only) */}
              {activeTab === "tree" && (
                <div className="jv-path">
                  {currentPath.split(".").map((seg, i, arr) => (
                    <span key={i}>
                      <span
                        className="jv-path-seg"
                        onClick={() => setCurrentPath(arr.slice(0, i + 1).join("."))}
                      >
                        {seg}
                      </span>
                      {i < arr.length - 1 && <span className="jv-path-arrow"> › </span>}
                    </span>
                  ))}
                </div>
              )}

              {/* formatted */}
              {activeTab === "formatted" &&
                (formatted ? (
                  <div className="jv-output">
                    <pre dangerouslySetInnerHTML={{ __html: syntaxHL(formatted) }} />
                  </div>
                ) : (
                  <div className="jv-empty">
                    <div className="jv-empty-icon">{"{ }"}</div>
                    <div className="jv-empty-title">
                      {parseError ? "Invalid JSON" : "No output yet"}
                    </div>
                    <div className="jv-empty-sub">
                      {parseError || "Paste JSON on the left and click Format, or press Ctrl+Shift+F"}
                    </div>
                  </div>
                ))}

              {/* tree */}
              {activeTab === "tree" &&
                (parsedData ? (
                  <div className="jv-output">
                    <TreeNode keyName={null} data={parsedData} searchQuery={searchQuery} />
                  </div>
                ) : (
                  <div className="jv-empty">
                    <div className="jv-empty-icon">🌿</div>
                    <div className="jv-empty-title">Tree View</div>
                    <div className="jv-empty-sub">Enter valid JSON to explore the tree</div>
                  </div>
                ))}

              {/* minified */}
              {activeTab === "minified" &&
                (minified ? (
                  <div className="jv-output">
                    <pre
                      style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}
                      dangerouslySetInnerHTML={{ __html: syntaxHL(minified) }}
                    />
                  </div>
                ) : (
                  <div className="jv-empty">
                    <div className="jv-empty-icon">⊟</div>
                    <div className="jv-empty-title">Minified</div>
                    <div className="jv-empty-sub">Enter valid JSON to see minified output</div>
                  </div>
                ))}

              {/* diff */}
              {activeTab === "diff" && (
                <DiffView original={input} formatted={formatted} />
              )}
            </div>
          </div>
        </div>

        {/* status bar */}
        <div className="jv-statusbar">
          <div className="jv-status-item" style={{ paddingLeft: 0 }}>
            {statusContent}
          </div>
          <div className="jv-status-item">
            <span className="jv-status-label">Size</span>
            <span className="jv-status-val">{fmtBytes(stats.bytes)}</span>
          </div>
          <div className="jv-status-item">
            <span className="jv-status-label">Lines</span>
            <span className="jv-status-val">{stats.lines}</span>
          </div>
          <div className="jv-status-item">
            <span className="jv-status-label">Keys</span>
            <span className="jv-status-val">{hasInput && isValid ? stats.keys : "—"}</span>
          </div>
          <div className="jv-status-item">
            <span className="jv-status-label">Depth</span>
            <span className="jv-status-val">{hasInput && isValid ? stats.depth : "—"}</span>
          </div>
          <div className="jv-statusbar-spacer" />
          <div className="jv-status-item" style={{ fontSize: 10, color: "rgba(139,156,191,0.4)", letterSpacing: "0.05em" }}>
            Ctrl+Shift+F Format · Ctrl+S Download
          </div>
        </div>

        {/* toast */}
        <div className={`jv-toast${toast.show ? " show" : ""}`}>
          <div className="jv-toast-icon">{toast.icon}</div>
          {toast.msg}
        </div>
      </div>
    </>
  );
}
