const cppDefaultCode = `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`;

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

const javaDefaultCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;

const goDefaultCode = `package main

import "fmt"

func main() {
    fmt.Println("Hello, 世界")
}`;

const javascriptDefaultCode = `console.log("Hello, World!");`;

const typescriptDefaultCode = `const greeting: string = "Hello, World!";
console.log(greeting);`;

const jsonDefaultCode = `{
  "name": "example",
  "version": "1.0.0",
  "description": "A sample JSON file"
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

const markdownDefaultCode = `# Hello, World!

This is a **markdown** document.

- Item 1
- Item 2
- Item 3`;

const phpDefaultCode = `<?php
echo "Hello, World!";
?>`;

const pythonDefaultCode = `print("Hello, World!")`;

const rustDefaultCode = `fn main() {
    println!("Hello, World!");
}`;

const sqlDefaultCode = `SELECT * FROM users WHERE active = true;`;

const xmlDefaultCode = `<?xml version="1.0" encoding="UTF-8"?>
<root>
    <message>Hello, World!</message>
</root>`;

const lessDefaultCode = `@primary-color: #4CAF50;

.container {
  color: @primary-color;
  padding: 20px;
}`;

const sassDefaultCode = `$primary-color: #4CAF50

.container
  color: $primary-color
  padding: 20px`;

const clojureDefaultCode = `(println "Hello, World!")`;

const csharpDefaultCode = `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");
    }
}`;

export const defaultCodeSnippets: Record<string, string> = {
    cpp: cppDefaultCode,
    html: htmlDefaultCode,
    java: javaDefaultCode,
    go: goDefaultCode,
    javascript: javascriptDefaultCode,
    typescript: typescriptDefaultCode,
    json: jsonDefaultCode,
    lezer: lezerDefaultCode,
    markdown: markdownDefaultCode,
    php: phpDefaultCode,
    python: pythonDefaultCode,
    rust: rustDefaultCode,
    sql: sqlDefaultCode,
    xml: xmlDefaultCode,
    less: lessDefaultCode,
    sass: sassDefaultCode,
    clojure: clojureDefaultCode,
    csharp: csharpDefaultCode,
};