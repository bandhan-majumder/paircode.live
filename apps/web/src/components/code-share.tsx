"use client";

import CodeMirror from '@uiw/react-codemirror';
import { tags as t } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";
import React from 'react';

interface CodeShareProps {
  code: string;
  onChange: (value: string) => void;
  extensions: any[];
}

const myTheme = createTheme({
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


export default function CodeShare({ code, onChange, extensions }: CodeShareProps) {
  const onChangeArg = React.useCallback((code: any, viewUpdate: any) => {
    onChange(code);
  }, []);

  return (
    <CodeMirror
      style={{ padding: '0px', margin: '0px', borderRadius: "4px" }}
      value={code}
      height="99vh"
      theme={myTheme}
      extensions={extensions}
      onChange={onChangeArg}
    />
  );
}