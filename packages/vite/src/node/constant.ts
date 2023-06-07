import path from 'node:path'

const EXTERNAL_TYPES = [
  'css',
  'less',
  'sass',
  'scss',
  'styl',
  'stylus',
  'pcss',
  'postcss',
  'vue',
  'svelte',
  'marko',
  'astro',
  'png',
  'jpe?g',
  'gif',
  'svg',
  'ico',
  'webp',
  'avif',
]

const BARE_IMPORT_RE = /^[\w@][^:]/

const PRE_BUNDLE_DIR = path.resolve('node_modules', '.pvite')

const HASH_RE = /#.*$/s

const QUERY_RE = /\?.*$/s

const JS_TYPES_RE = /\.(?j|t)sx?$|\.mjs$/

export { EXTERNAL_TYPES, BARE_IMPORT_RE, PRE_BUNDLE_DIR, HASH_RE, QUERY_RE, JS_TYPES_RE }
