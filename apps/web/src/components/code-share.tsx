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

const myDarkTheme = createTheme({
  theme: "dark",
  settings: {
    background: "#1e1e2e",
    foreground: "#cdd6f4",
    caret: "#f5e0dc",
    selection: "#585b70aa",
    selectionMatch: "#89b4fa",
    lineHighlight: "#313244",
    gutterBackground: "#1e1e2e",
    gutterForeground: "#6c7086"
  },
  styles: [
    { tag: t.comment, color: "#6c7086" },
    { tag: t.variableName, color: "#cba6f7" },
    { tag: t.quote, color: "#cdd6f4" },
    { tag: t.moduleKeyword, color: "#f38ba8" },
    { tag: [t.string, t.special(t.brace)], color: "#a6e3a1" },
    { tag: t.number, color: "#fab387" },
    { tag: t.bool, color: "#fab387" },
    { tag: t.null, color: "#fab387" },
    { tag: t.keyword, color: "#f38ba8" },
    { tag: t.operator, color: "#89dceb" },
    { tag: t.className, color: "#f9e2af" },
    { tag: t.definition(t.typeName), color: "#f9e2af" },
    { tag: t.typeName, color: "#f9e2af" },
    { tag: t.angleBracket, color: "#cdd6f4" },
    { tag: t.tagName, color: "#89b4fa" },
    { tag: t.attributeName, color: "#f9e2af" },
    { tag: t.propertyName, color: "#a6e3a1" },
    { tag: t.annotation, color: "#f38ba8" }
  ]
});

const myLightTheme = createTheme({
  theme: "light",
  settings: {
    background: "#ffffff",
    foreground: "#4c4f69",
    caret: "#dc8a78",
    selection: "#dce0e8aa",
    selectionMatch: "#7287fd",
    lineHighlight: "#eff1f5",
    gutterBackground: "#ffffff",
    gutterForeground: "#9ca0b0"
  },
  styles: [
    { tag: t.comment, color: "#9ca0b0" },
    { tag: t.variableName, color: "#8839ef" },
    { tag: t.quote, color: "#4c4f69" },
    { tag: t.moduleKeyword, color: "#d20f39" },
    { tag: [t.string, t.special(t.brace)], color: "#40a02b" },
    { tag: t.number, color: "#df8e1d" },
    { tag: t.bool, color: "#df8e1d" },
    { tag: t.null, color: "#df8e1d" },
    { tag: t.keyword, color: "#d20f39" },
    { tag: t.operator, color: "#04a5e5" },
    { tag: t.className, color: "#e5c890" },
    { tag: t.definition(t.typeName), color: "#e5c890" },
    { tag: t.typeName, color: "#e5c890" },
    { tag: t.angleBracket, color: "#4c4f69" },
    { tag: t.tagName, color: "#1e66f5" },
    { tag: t.attributeName, color: "#e5c890" },
    { tag: t.propertyName, color: "#40a02b" },
    { tag: t.annotation, color: "#d20f39" }
  ]
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