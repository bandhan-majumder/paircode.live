/**
 * More: https://uiwjs.github.io/react-codemirror/#/extensions/languages
 */

import { rust } from '@codemirror/lang-rust';
import { lezer } from '@codemirror/lang-lezer';
import { csharp } from '@replit/codemirror-lang-csharp';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';

const aplExtension = [loadLanguage('apl')];
const bashExtension = [loadLanguage('bash')];
const cExtension = [loadLanguage('c')];
const cljExtension = [loadLanguage('clj')];
const cljcExtension = [loadLanguage('cljc')];
const cljsExtension = [loadLanguage('cljs')];
const cmakeExtension = [loadLanguage('cmake')];
const coffeeExtension = [loadLanguage('coffee')];
const cppExtension = [loadLanguage('cpp')];
const crExtension = [loadLanguage('cr')];
const csharpExtension = [csharp()];
const cssExtension = [loadLanguage('css')];
const dartExtension = [loadLanguage('dart')];
const diffExtension = [loadLanguage('diff')];
const elmExtension = [loadLanguage('elm')];
const erlExtension = [loadLanguage('erl')];
const factorExtension = [loadLanguage('factor')];
const forthExtension = [loadLanguage('forth')];
const fsExtension = [loadLanguage('fs')];
const goExtension = [loadLanguage('go')];
const groovyExtension = [loadLanguage('groovy')];
const handlebarsExtension = [loadLanguage('handlebars')];
const hbsExtension = [loadLanguage('hbs')];
const hsExtension = [loadLanguage('hs')];
const htmlExtension = [loadLanguage('html')];
const jadeExtension = [loadLanguage('jade')];
const javaExtension = [loadLanguage('java')];
const jinjaExtension = [loadLanguage('jinja')];
const jlExtension = [loadLanguage('jl')];
const jsExtension = [loadLanguage('js')];
const jsonExtension = [loadLanguage('json')];
const jsxExtension = [loadLanguage('jsx')];
const ktExtension = [loadLanguage('kt')];
const lessExtension = [loadLanguage('less')];
const lezerExtension = [lezer()];
const liquidExtension = [loadLanguage('liquid')];
const lispExtension = [loadLanguage('lisp')];
const luaExtension = [loadLanguage('lua')];
const mdExtension = [loadLanguage('md')];
const mlExtension = [loadLanguage('ml')];
const nixExtension = [loadLanguage('nix')];
const pasExtension = [loadLanguage('pas')];
const phpExtension = [loadLanguage('php')];
const protoExtension = [loadLanguage('proto')];
const pugExtension = [loadLanguage('pug')];
const pyExtension = [loadLanguage('py')];
const rExtension = [loadLanguage('r')];
const rbExtension = [loadLanguage('rb')];
const rsExtension = [loadLanguage('rs')];
const rustExtension = [rust()];
const sassExtension = [loadLanguage('sass')];
const scalaExtension = [loadLanguage('scala')];
const scmExtension = [loadLanguage('scm')];
const scssExtension = [loadLanguage('scss')];
const shExtension = [loadLanguage('sh')];
const solidityExtension = [loadLanguage('solidity')];
const sqlExtension = [loadLanguage('sql')];
const svelteExtension = [loadLanguage('svelte')];
const svgExtension = [loadLanguage('svg')];
const swiftExtension = [loadLanguage('swift')];
const tclExtension = [loadLanguage('tcl')];
const texExtension = [loadLanguage('tex')];
const textExtension = [loadLanguage('text')];
const tomlExtension = [loadLanguage('toml')];
const tsExtension = [loadLanguage('ts')];
const tsxExtension = [loadLanguage('tsx')];
const vExtension = [loadLanguage('v')];
const vbExtension = [loadLanguage('vb')];
const vhdlExtension = [loadLanguage('vhdl')];
const vueExtension = [loadLanguage('vue')];
const wastExtension = [loadLanguage('wast')];
const xmlExtension = [loadLanguage('xml')];
const ymlExtension = [loadLanguage('yml')];

export const supportedLanguages = [
    "apl",
    "bash",
    "c",
    "clj",
    "cljc",
    "cljs",
    "cmake",
    "coffee",
    "cpp",
    "cr",
    "csharp",
    "css",
    "dart",
    "diff",
    "elm",
    "erl",
    "factor",
    "forth",
    "fs",
    "go",
    "groovy",
    "handlebars",
    "hbs",
    "hs",
    "html",
    "jade",
    "java",
    "jinja",
    "jl",
    "js",
    "json",
    "jsx",
    "kt",
    "less",
    "lezer",
    "liquid",
    "lisp",
    "lua",
    "md",
    "ml",
    "nix",
    "pas",
    "php",
    "proto",
    "pug",
    "py",
    "r",
    "rb",
    "rs",
    "rust",
    "sass",
    "scala",
    "scm",
    "scss",
    "sh",
    "solidity",
    "sql",
    "svelte",
    "svg",
    "swift",
    "tcl",
    "tex",
    "text",
    "toml",
    "ts",
    "tsx",
    "v",
    "vb",
    "vhdl",
    "vue",
    "wast",
    "xml",
    "yml"
];

export const languageExtensions: Record<string, any> = {
    apl: aplExtension,
    bash: bashExtension,
    c: cExtension,
    clj: cljExtension,
    cljc: cljcExtension,
    cljs: cljsExtension,
    cmake: cmakeExtension,
    coffee: coffeeExtension,
    cpp: cppExtension,
    cr: crExtension,
    csharp: csharpExtension,
    css: cssExtension,
    dart: dartExtension,
    diff: diffExtension,
    elm: elmExtension,
    erl: erlExtension,
    factor: factorExtension,
    forth: forthExtension,
    fs: fsExtension,
    go: goExtension,
    groovy: groovyExtension,
    handlebars: handlebarsExtension,
    hbs: hbsExtension,
    hs: hsExtension,
    html: htmlExtension,
    jade: jadeExtension,
    java: javaExtension,
    jinja: jinjaExtension,
    jl: jlExtension,
    js: jsExtension,
    json: jsonExtension,
    jsx: jsxExtension,
    kt: ktExtension,
    less: lessExtension,
    lezer: lezerExtension,
    liquid: liquidExtension,
    lisp: lispExtension,
    lua: luaExtension,
    md: mdExtension,
    ml: mlExtension,
    nix: nixExtension,
    pas: pasExtension,
    php: phpExtension,
    proto: protoExtension,
    pug: pugExtension,
    py: pyExtension,
    r: rExtension,
    rb: rbExtension,
    rs: rsExtension,
    rust: rustExtension,
    sass: sassExtension,
    scala: scalaExtension,
    scm: scmExtension,
    scss: scssExtension,
    sh: shExtension,
    solidity: solidityExtension,
    sql: sqlExtension,
    svelte: svelteExtension,
    svg: svgExtension,
    swift: swiftExtension,
    tcl: tclExtension,
    tex: texExtension,
    text: textExtension,
    toml: tomlExtension,
    ts: tsExtension,
    tsx: tsxExtension,
    v: vExtension,
    vb: vbExtension,
    vhdl: vhdlExtension,
    vue: vueExtension,
    wast: wastExtension,
    xml: xmlExtension,
    yml: ymlExtension,
};