"use client";

import { use, useEffect, useState } from "react";
import CodeShare from "@/components/code-share";
import { DropdownMenuLanguageCheckboxes } from "@/components/lang-dropdown";
import VideoBox from "@/components/video-box";
import { languageExtensions } from "@/lib/languageExtensions";
import { defaultCodeSnippets } from "@/lib/defaultCodeSnippets";
import { ShareRoomDialog } from "@/components/share-dialog";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useSocketIO } from "@/hooks/use-websocket";

type Props = {
  params: Promise<{ id: string }>;
};

export default function CodeArena({ params }: Props) {
  const { id } = use(params);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const handleMessageReceived = (content: string) => {
    try {
      const data = JSON.parse(content);
      if (data.code !== undefined) {
        setCode(data.code);
      }
      console.log("data is: ", data);
      console.log("data language is: ", data.language);
      if (data.language !== undefined) {
        console.log("still coming? ", data.language)
        setSelectedLanguage(data.language);
      }
    } catch (error) {
      console.error("Error parsing received message:", error);
    }
  };

  const { sendMessage, isConnected } = useSocketIO({
    roomId: id,
    onMessageReceived: handleMessageReceived,
  });

  useEffect(() => {
    if (!session && !isPending) {
      router.push("/login");
    }
  }, [session, isPending]);

  if (!session) {
    return null;
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const newCode = defaultCodeSnippets[language] || "";
    setCode(newCode);
    sendMessage(JSON.stringify({ language, code: newCode }));
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    sendMessage(JSON.stringify({ code: value, language: selectedLanguage.length > 0 ? selectedLanguage : undefined }));
  };

  const currentExtensions =
    selectedLanguage && languageExtensions[selectedLanguage]
      ? languageExtensions[selectedLanguage]
      : [];

  return (
    <div className="grid grid-cols-3 gap-0 p-0">
      <div className="col-span-2 relative">
        <div className="absolute right-10 top-5 z-50">
          <div className="flex flex-col gap-4">
            {session && <ShareRoomDialog session={session} roomId={id} />}
            <DropdownMenuLanguageCheckboxes
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
            />
            <div className="text-xs text-gray-400">
              {isConnected ? " Connected" : " Disconnected"}
            </div>
          </div>
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