"use client";

import { useState } from "react";
import CodeShare from "@/components/code-share";
import { DropdownMenuLanguageCheckboxes } from "@/components/lang-dropdown";
import VideoBox from "@/components/video-box";
import { languageExtensions } from "@/lib/languageExtensions";
import { defaultCodeSnippets } from "@/lib/defaultCodeSnippets"; 

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(defaultCodeSnippets[language] || "");
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  const currentExtensions = selectedLanguage && languageExtensions[selectedLanguage]
    ? languageExtensions[selectedLanguage]
    : [];

  return (
    <div className="grid grid-cols-3 gap-0 p-0">
      <div className="col-span-2 relative">
        <div className="absolute right-10 top-5 z-50">
          <DropdownMenuLanguageCheckboxes 
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
        </div>
        <CodeShare 
          value={code}
          onChange={handleCodeChange}
          extensions={currentExtensions}
        />
      </div>
      <div className="flex flex-col justify-center gap-20 w-full bg-[#282C34]">
        <div>
          <VideoBox />
        </div>
        <div>
          <VideoBox />
        </div>
      </div>
    </div>
  );
}
