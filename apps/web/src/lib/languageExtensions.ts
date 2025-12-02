
import { javascript } from '@codemirror/lang-javascript';
import { go } from '@codemirror/lang-go';
import { cpp } from "@codemirror/lang-cpp"
import { html } from '@codemirror/lang-html';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { sql } from '@codemirror/lang-sql';
import { xml } from '@codemirror/lang-xml';
import { php } from '@codemirror/lang-php';
import { markdown } from '@codemirror/lang-markdown';
import { json } from '@codemirror/lang-json';
import { lezer } from '@codemirror/lang-lezer';
import { less } from '@codemirror/lang-less';
import { sass } from '@codemirror/lang-sass';
import { clojure } from '@nextjournal/lang-clojure';
import { csharp } from '@replit/codemirror-lang-csharp';

const jsExtension = [javascript({ jsx: true })];
const tsExtension = [javascript({ typescript: true })];
const goExtension = [go()];
const cppExtension = [cpp()];
const htmlExtension = [html()];
const javaExtension = [java()];
const pythonExtension = [python()];
const rustExtension = [rust()];
const sqlExtension = [sql()];
const xmlExtension = [xml()];
const phpExtension = [php()];
const markdownExtension = [markdown()];
const jsonExtension = [json()];
const lezerExtension = [lezer()];
const lessExtension = [less()];
const sassExtension = [sass()];
const clojureExtension = [clojure()];
const csharpExtension = [csharp()];

export const languageExtensions: Record<string, any> = {
    javascript: jsExtension,
    typescript: tsExtension,
    go: goExtension,
    cpp: cppExtension,
    html: htmlExtension,
    java: javaExtension,
    python: pythonExtension,
    rust: rustExtension,
    sql: sqlExtension,
    xml: xmlExtension,
    php: phpExtension,
    markdown: markdownExtension,
    json: jsonExtension,
    lezer: lezerExtension,
    less: lessExtension,
    sass: sassExtension,
    clojure: clojureExtension,
    csharp: csharpExtension,
};