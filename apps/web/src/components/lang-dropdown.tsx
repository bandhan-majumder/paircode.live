"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DropDownProps {
    onLanguageChange: (language: string) => void;
    selectedLanguage: string
}

export function DropdownMenuLanguageCheckboxes({
    selectedLanguage,
    onLanguageChange
}: DropDownProps) {
    const languages = [
        "cpp",
        "html",
        "java",
        "go",
        "javascript",
        "typescript",
        "json",
        "markdown",
        "php",
        "python",
        "rust",
        "sql",
        "xml",
        "less",
        "sass",
        "clojure",
        "csharp",
        "lezer"
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-27 bg-black text-[#D1D5DC] hover:bg-black hover:text-white">{selectedLanguage || 'default'}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#364153] text-[#D1D5DC]">
                {languages.map((language) => (
                    <DropdownMenuCheckboxItem
                        key={language}
                        checked={selectedLanguage === language}
                        onCheckedChange={(checked) => {
                            if (checked) onLanguageChange(language)
                        }}
                    >
                        {language}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}