"use client";

import CodeMirror from '@uiw/react-codemirror';
import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";
import React from 'react';
import { useTheme } from 'next-themes';

interface CodeShareProps {
  code: string;
  onChange: (value: string) => void;
  extensions: any[];
  isOutSourcedScreen?: boolean
}

// Customize themes: https://uiwjs.github.io/react-codemirror/#/editor/theme/single
const myDarkTheme = createTheme({
  theme: "dark",
  settings: {
    backgroundImage: '',
    selection: 'rgba(137, 180, 250, 0.3)',
    gutterBorder: '#313244',
    gutterActiveForeground: '#89b4fa',
    background: "#1e1e2e",
    foreground: "#cdd6f4",
    caret: "#f5e0dc",
    selectionMatch: 'rgba(137, 180, 250, 0.2)',
    lineHighlight: "rgba(137, 180, 250, 0.05)",
    gutterBackground: "#181825",
    gutterForeground: "#6c7086"
  },
  styles: [
    { tag: t.comment, color: "#6c7086", fontStyle: "italic" },
    { tag: t.variableName, color: "#cba6f7" },
    { tag: t.special(t.variableName), color: "#f5c2e7" },
    { tag: t.quote, color: "#cdd6f4" },
    { tag: t.moduleKeyword, color: "#f38ba8" },
    { tag: [t.string, t.special(t.brace)], color: "#a6e3a1" },
    { tag: t.number, color: "#fab387" },
    { tag: t.bool, color: "#fab387" },
    { tag: t.null, color: "#fab387" },
    { tag: t.keyword, color: "#cba6f7" },
    { tag: t.operator, color: "#89dceb" },
    { tag: t.function(t.variableName), color: "#89b4fa" },
    { tag: t.className, color: "#f9e2af" },
    { tag: t.definition(t.className), color: "#f9e2af" },
    { tag: t.definition(t.typeName), color: "#f9e2af" },
    { tag: t.typeName, color: "#f9e2af" },
    { tag: t.angleBracket, color: "#cdd6f4" },
    { tag: t.tagName, color: "#89b4fa" },
    { tag: t.attributeName, color: "#fab387" },
    { tag: t.propertyName, color: "#94e2d5" },
    { tag: t.annotation, color: "#f38ba8" },
    { tag: t.regexp, color: "#f38ba8" },
    { tag: t.labelName, color: "#89dceb" },
    { tag: t.processingInstruction, color: "#f38ba8" }
  ]
});


const myLightTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#eff1f5',
    backgroundImage: '',
    foreground: '#4c4f69',
    caret: '#dc8a78',
    selection: 'rgba(220, 138, 120, 0.3)',
    selectionMatch: 'rgba(220, 138, 120, 0.2)',
    gutterBackground: '#e6e9ef',
    gutterForeground: '#6c6f85',
    gutterBorder: '#ccd0da',
    gutterActiveForeground: '#1e66f5',
    lineHighlight: 'rgba(220, 138, 120, 0.08)',
  },
  styles: [
    { tag: t.comment, color: '#9ca0b0', fontStyle: "italic" },
    { tag: t.variableName, color: '#8839ef' },
    { tag: t.special(t.variableName), color: '#ea76cb' },
    { tag: t.quote, color: '#4c4f69' },
    { tag: t.moduleKeyword, color: '#d20f39' },
    { tag: [t.string, t.special(t.brace)], color: '#40a02b' },
    { tag: t.number, color: '#fe640b' },
    { tag: t.bool, color: '#fe640b' },
    { tag: t.null, color: '#fe640b' },
    { tag: t.keyword, color: '#8839ef' },
    { tag: t.operator, color: '#179299' },
    { tag: t.function(t.variableName), color: '#1e66f5' },
    { tag: t.className, color: '#df8e1d' },
    { tag: t.definition(t.className), color: '#df8e1d' },
    { tag: t.definition(t.typeName), color: '#df8e1d' },
    { tag: t.typeName, color: '#df8e1d' },
    { tag: t.angleBracket, color: '#4c4f69' },
    { tag: t.tagName, color: '#1e66f5' },
    { tag: t.attributeName, color: '#fe640b' },
    { tag: t.propertyName, color: '#04a5e5' },
    { tag: t.annotation, color: '#d20f39' },
    { tag: t.regexp, color: '#d20f39' },
    { tag: t.labelName, color: '#179299' },
    { tag: t.processingInstruction, color: '#d20f39' }
  ],
});


export default function CodeShare({ code, onChange, extensions, isOutSourcedScreen = false }: CodeShareProps) {
  const onChangeArg = React.useCallback((code: any, viewUpdate: any) => {
    onChange(code);
  }, []);

  const { theme } = useTheme();

  return (
    <CodeMirror
      style={{ padding: '0px', margin: '0px', borderRadius: "4px" }}
      value={code}
      height={isOutSourcedScreen ? "100vh" : "calc(100vh - 60px)"}
      className="md:h-full"
      theme={theme === "dark" ? myDarkTheme : myLightTheme}
      extensions={extensions}
      onChange={onChangeArg}
    />
  );
}