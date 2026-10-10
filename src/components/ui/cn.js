/**
 * cn.js — Classnames and Tailwind utility
 *
 * Conditionally joins class names, handles conditional expressions,
 * nested arrays, and boolean object maps.
 * Zero external dependency ensures 100% resilience against Vite
 * pre-bundling cache errors and dev-server restarts.
 */

function toVal(mix) {
  let k;
  let y;
  let str = '';

  if (typeof mix === 'string' || typeof mix === 'number') {
    str += mix;
  } else if (typeof mix === 'object') {
    if (Array.isArray(mix)) {
      const len = mix.length;
      for (k = 0; k < len; k++) {
        if (mix[k]) {
          y = toVal(mix[k]);
          if (y) {
            if (str) str += ' ';
            str += y;
          }
        }
      }
    } else if (mix !== null) {
      for (k in mix) {
        if (mix[k]) {
          if (str) str += ' ';
          str += k;
        }
      }
    }
  }

  return str;
}

export function cn(...inputs) {
  let str = '';
  for (let i = 0; i < inputs.length; i++) {
    const val = toVal(inputs[i]);
    if (val) {
      if (str) str += ' ';
      str += val;
    }
  }

  return str.trim().replace(/\s+/g, ' ');
}

export default cn;
