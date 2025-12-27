"use client"

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
                <Button variant="outline" className="w-27 bg-[#D1D5DC] dark:bg-[#292929] text-black dark:text-[#D1D5DC]  hover:bg-[#D1D5DC] dark:hover:bg-[#292929] dark:hover:text-white">{selectedLanguage || 'default'}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-black dark:bg-[#292929] dark:text-[#D1D5DC]">
                {languages.map((language) => (
                    <DropdownMenuCheckboxItem
                        key={language}
                        checked={selectedLanguage === language}
                        onCheckedChange={(checked: boolean) => {
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