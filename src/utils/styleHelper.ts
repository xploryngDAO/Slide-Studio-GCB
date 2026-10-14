import React from 'react';

/**
 * Safely converts a CSS inline style string (e.g., "background-color: #fff; font-family: Inter;")
 * into a React-compliant camelCase style object (e.g., { backgroundColor: '#fff', fontFamily: 'Inter' }).
 */
export function cssStringToStyleObject(cssString?: string): React.CSSProperties {
  if (!cssString || typeof cssString !== 'string') return {};

  const styleObj: Record<string, string> = {};
  const rules = cssString.split(';').map((r) => r.trim()).filter(Boolean);

  for (const rule of rules) {
    const colonIndex = rule.indexOf(':');
    if (colonIndex === -1) continue;

    const rawKey = rule.slice(0, colonIndex).trim();
    const rawVal = rule.slice(colonIndex + 1).trim();
    if (!rawKey || !rawVal) continue;

    // Convert kebab-case (e.g. background-color, font-family, min-height) to camelCase
    let camelKey = rawKey;
    if (!rawKey.startsWith('--')) {
      camelKey = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    }

    styleObj[camelKey] = rawVal;
  }

  return styleObj as React.CSSProperties;
}
