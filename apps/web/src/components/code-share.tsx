"use client";
import CodeMirror from '@uiw/react-codemirror';

interface CodeShareProps {
  value: string;
  onChange: (value: string) => void;
  extensions: any[];
}

export default function CodeShare({ value, onChange, extensions }: CodeShareProps) {
  return (
    <CodeMirror
      value={value}
      height="100vh"
      theme={'dark'}
      extensions={extensions}
      onChange={(value, viewUpdate) => {
        onChange(value);
      }}
    />
  );
}