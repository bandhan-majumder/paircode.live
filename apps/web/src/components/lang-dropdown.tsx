"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { supportedLanguages } from "@/lib/languageExtensions"
import { useState } from "react"
import { X } from "lucide-react"

interface DropDownProps {
    onLanguageChange: (language: string) => void;
    selectedLanguage: string
}

export function DropdownMenuLanguageCheckboxes({
    selectedLanguage,
    onLanguageChange
}: DropDownProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredLanguages = supportedLanguages.filter((language) =>
        language.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-27 bg-[#D1D5DC] dark:bg-[#292929] text-black dark:text-[#D1D5DC] hover:bg-[#D1D5DC] dark:hover:bg-[#292929] dark:hover:text-white">
                    {selectedLanguage || 'py'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-black dark:bg-[#292929] dark:text-[#D1D5DC]">
                <div className="px-2 py-1.5 relative">
                    <Input
                        placeholder="Search languages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-600 pr-8"
                        onKeyDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {filteredLanguages.length > 0 ? (
                        filteredLanguages.map((language) => (
                            <DropdownMenuCheckboxItem
                                key={language}
                                checked={selectedLanguage === language}
                                onCheckedChange={(checked: boolean) => {
                                    if (checked) {
                                        onLanguageChange(language)
                                        setSearchQuery("")
                                    }
                                }}
                            >
                                {language}
                            </DropdownMenuCheckboxItem>
                        ))
                    ) : (
                        <div className="px-2 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                            No languages found
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}