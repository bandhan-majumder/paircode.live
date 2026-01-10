const aplDefaultCode = `⍝ Hello, World! in APL
'Hello, World!'`;

const bashDefaultCode = `#!/bin/bash
echo "Hello, World!"`;

const cDefaultCode = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;

const cljDefaultCode = `(println "Hello, World!")`;

const cljcDefaultCode = `(println "Hello, World!")`;

const cljsDefaultCode = `(println "Hello, World!")`;

const clojureDefaultCode = `(println "Hello, World!")`;

const cmakeDefaultCode = `cmake_minimum_required(VERSION 3.10)
project(HelloWorld)

add_executable(hello main.cpp)`;

const coffeeDefaultCode = `console.log "Hello, World!"`;

const cppDefaultCode = `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`;

const crDefaultCode = `puts "Hello, World!"`;

const csharpDefaultCode = `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
    }
}`;

const cssDefaultCode = `body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
}`;

const dartDefaultCode = `void main() {
  print('Hello, World!');
}`;

const diffDefaultCode = `--- a/file.txt
+++ b/file.txt
@@ -1,3 +1,3 @@
-Hello, World!
+Hello, Universe!`;

const elmDefaultCode = `module Main exposing (..)

import Html exposing (text)

main =
    text "Hello, World!"`;

const erlDefaultCode = `-module(hello).
-export([hello_world/0]).

hello_world() ->
    io:fwrite("Hello, World!~n").`;

const factorDefaultCode = `"Hello, World!" print`;

const forthDefaultCode = `: HELLO  ( -- )  ." Hello, World!" CR ;
HELLO`;

const fsDefaultCode = `printfn "Hello, World!"`;

const goDefaultCode = `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`;

const groovyDefaultCode = `println "Hello, World!"`;

const handlebarsDefaultCode = `<h1>{{title}}</h1>
<p>{{message}}</p>`;

const hbsDefaultCode = `<h1>{{title}}</h1>
<p>{{message}}</p>`;

const hsDefaultCode = `main :: IO ()
main = putStrLn "Hello, World!"`;

const htmlDefaultCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`;

const jadeDefaultCode = `doctype html
html
  head
    title Hello
  body
    h1 Hello, World!`;

const javaDefaultCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;

const javascriptDefaultCode = `console.log("Hello, World!");`;

const jinjaDefaultCode = `<!DOCTYPE html>
<html>
<head>
    <title>{{ title }}</title>
</head>
<body>
    <h1>{{ heading }}</h1>
</body>
</html>`;

const jlDefaultCode = `println("Hello, World!")`;

const jsDefaultCode = `console.log("Hello, World!");`;

const jsonDefaultCode = `{
  "name": "example",
  "version": "1.0.0",
  "description": "A sample JSON file"
}`;

const jsxDefaultCode = `export default function App() {
  return <h1>Hello, World!</h1>;
}`;

const ktDefaultCode = `fun main() {
    println("Hello, World!")
}`;

const lessDefaultCode = `@primary-color: #4CAF50;

.container {
  color: @primary-color;
  padding: 20px;
}`;

const lezerDefaultCode = `@top Program { expression+ }

expression {
  Number |
  String
}

@tokens {
  Number { @digit+ }
  String { '"' !["]* '"' }
}`;

const liquidDefaultCode = `<h1>{{ page.title }}</h1>
<p>{{ page.content }}</p>`;

const lispDefaultCode = `(print "Hello, World!")`;

const luaDefaultCode = `print("Hello, World!")`;

const markdownDefaultCode = `# Hello, World!

This is a **markdown** document.

- Item 1
- Item 2
- Item 3`;

const mdDefaultCode = `# Hello, World!

This is a **markdown** document.

- Item 1
- Item 2
- Item 3`;

const mlDefaultCode = `print_endline "Hello, World!";;`;

const nixDefaultCode = `{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [ pkgs.hello ];
}`;

const pasDefaultCode = `program HelloWorld;
begin
  WriteLn('Hello, World!');
end.`;

const phpDefaultCode = `<?php
echo "Hello, World!";
?>`;

const protoDefaultCode = `syntax = "proto3";

message Person {
  string name = 1;
  int32 id = 2;
  string email = 3;
}`;

const pugDefaultCode = `doctype html
html
  head
    title Hello
  body
    h1 Hello, World!`;

const pyDefaultCode = `print("Hello, World!")`;

const rDefaultCode = `print("Hello, World!")`;

const rbDefaultCode = `puts "Hello, World!"`;

const rsDefaultCode = `fn main() {
    println!("Hello, World!");
}`;

const rustDefaultCode = `fn main() {
    println!("Hello, World!");
}`;

const sassDefaultCode = `$primary-color: #4CAF50

.container
  color: $primary-color
  padding: 20px`;

const scalaDefaultCode = `object HelloWorld {
  def main(args: Array[String]): Unit = {
    println("Hello, World!")
  }
}`;

const scmDefaultCode = `(display "Hello, World!")
(newline)`;

const scssDefaultCode = `$primary-color: #4CAF50;

.container {
  color: $primary-color;
  padding: 20px;
}`;

const shDefaultCode = `#!/bin/sh
echo "Hello, World!"`;

const solidityDefaultCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    function sayHello() public pure returns (string memory) {
        return "Hello, World!";
    }
}`;

const sqlDefaultCode = `SELECT * FROM users WHERE active = true;`;

const svelteDefaultCode = `<script>
  let name = 'World';
</script>

<h1>Hello, {name}!</h1>`;

const svgDefaultCode = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="blue" />
</svg>`;

const swiftDefaultCode = `print("Hello, World!")`;

const tclDefaultCode = `puts "Hello, World!"`;

const texDefaultCode = `\\documentclass{article}
\\begin{document}
Hello, World!
\\end{document}`;

const tomlDefaultCode = `[package]
name = "example"
version = "1.0.0"

[dependencies]`;

const tsDefaultCode = `const greeting: string = "Hello, World!";
console.log(greeting);`;

const typescriptDefaultCode = `const greeting: string = "Hello, World!";
console.log(greeting);`;

const tsxDefaultCode = `export default function App() {
  return <h1>Hello, World!</h1>;
}`;

const vDefaultCode = `fn main() {
	println('Hello, World!')
}`;

const vbDefaultCode = `Module HelloWorld
    Sub Main()
        Console.WriteLine("Hello, World!")
    End Sub
End Module`;

const vhdlDefaultCode = `library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity HelloWorld is
end HelloWorld;

architecture Behavioral of HelloWorld is
begin
end Behavioral;`;

const vueDefaultCode = `<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello, World!'
    }
  }
}
</script>`;

const wastDefaultCode = `(module
  (import "env" "print" (func $print (param i32)))
  (func $main
    i32.const 42
    call $print
  )
  (start $main)
)`;

const xmlDefaultCode = `<?xml version="1.0" encoding="UTF-8"?>
<root>
    <message>Hello, World!</message>
</root>`;

const ymlDefaultCode = `name: example
version: 1.0.0
description: A sample YAML file`;

export const defaultCodeSnippets: Record<string, string> = {
    apl: aplDefaultCode,
    bash: bashDefaultCode,
    c: cDefaultCode,
    clj: cljDefaultCode,
    cljc: cljcDefaultCode,
    cljs: cljsDefaultCode,
    clojure: clojureDefaultCode,
    cmake: cmakeDefaultCode,
    coffee: coffeeDefaultCode,
    cpp: cppDefaultCode,
    cr: crDefaultCode,
    csharp: csharpDefaultCode,
    css: cssDefaultCode,
    dart: dartDefaultCode,
    diff: diffDefaultCode,
    elm: elmDefaultCode,
    erl: erlDefaultCode,
    factor: factorDefaultCode,
    forth: forthDefaultCode,
    fs: fsDefaultCode,
    go: goDefaultCode,
    groovy: groovyDefaultCode,
    handlebars: handlebarsDefaultCode,
    hbs: hbsDefaultCode,
    hs: hsDefaultCode,
    html: htmlDefaultCode,
    jade: jadeDefaultCode,
    java: javaDefaultCode,
    javascript: javascriptDefaultCode,
    jinja: jinjaDefaultCode,
    jl: jlDefaultCode,
    js: jsDefaultCode,
    json: jsonDefaultCode,
    jsx: jsxDefaultCode,
    kt: ktDefaultCode,
    less: lessDefaultCode,
    lezer: lezerDefaultCode,
    liquid: liquidDefaultCode,
    lisp: lispDefaultCode,
    lua: luaDefaultCode,
    markdown: markdownDefaultCode,
    md: mdDefaultCode,
    ml: mlDefaultCode,
    nix: nixDefaultCode,
    pas: pasDefaultCode,
    php: phpDefaultCode,
    proto: protoDefaultCode,
    pug: pugDefaultCode,
    py: pyDefaultCode,
    r: rDefaultCode,
    rb: rbDefaultCode,
    rs: rsDefaultCode,
    rust: rustDefaultCode,
    sass: sassDefaultCode,
    scala: scalaDefaultCode,
    scm: scmDefaultCode,
    scss: scssDefaultCode,
    sh: shDefaultCode,
    solidity: solidityDefaultCode,
    sql: sqlDefaultCode,
    svelte: svelteDefaultCode,
    svg: svgDefaultCode,
    swift: swiftDefaultCode,
    tcl: tclDefaultCode,
    tex: texDefaultCode,
    toml: tomlDefaultCode,
    ts: tsDefaultCode,
    typescript: typescriptDefaultCode,
    tsx: tsxDefaultCode,
    v: vDefaultCode,
    vb: vbDefaultCode,
    vhdl: vhdlDefaultCode,
    vue: vueDefaultCode,
    wast: wastDefaultCode,
    xml: xmlDefaultCode,
    yml: ymlDefaultCode,
};