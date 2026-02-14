'use client';

import CodeShare from '@/components/code-share';
import { languageExtensions } from '@/lib/languageExtensions';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { defaultCodeSnippets } from '@/lib/defaultCodeSnippets';
import { CreateRoomDialog } from '@/components/create-room-dialog';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import type { authClient } from '@/lib/auth-client';

interface OutsourceClientProps {
    session: typeof authClient.$Infer.Session;
}

export default function OutsourceClient({ session }: OutsourceClientProps) {
    const searchParams = useSearchParams();
    const source = searchParams.get('source');
    const outSourcedCode = searchParams.get('code');
    const outSourcedCodeLang = searchParams.get('language');

    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCode = async () => {
            if (source === 'clipboard') {
                try {
                    // get clipboard permission
                    await navigator.permissions.query({ name: 'persistent-storage' });
                    const clipboardText = await navigator.clipboard.readText();
                    const sessionData = JSON.parse(clipboardText);

                    setCode(sessionData.code || '');
                    // BUG: if the language does not exist or so
                    setSelectedLanguage(sessionData.language || 'py');

                    toast.success('Code imported from VS Code!');
                } catch (error) {
                    console.error('Failed to read clipboard:', error);
                    toast.error('Failed to read code from clipboard. Please paste manually or grant clipboard permission.');

                    const lang = searchParams.get('language');
                    if (lang) {
                        setSelectedLanguage(lang);
                    }
                }
            }
            else {
                try {
                    if (outSourcedCode && outSourcedCodeLang) {
                        // const decodedCode = decodeURIComponent(outSourcedCode);
                        // const decodedLang = decodeURIComponent(outSourcedCodeLang);

                        setCode(outSourcedCode);

                        if (defaultCodeSnippets[outSourcedCodeLang]) {
                            setSelectedLanguage(outSourcedCodeLang);
                            toast.success('Code imported from VS Code!');
                        } else {
                            setSelectedLanguage('text');
                            toast.warning('Language extension is not supported. Falling back to text');
                        }
                    } else {
                        // No code provided
                        setCode(defaultCodeSnippets['py'] || '');
                        setSelectedLanguage('py');
                    }
                } catch (error) {
                    toast.error('Failed to load code from URL');
                    setCode(defaultCodeSnippets['py'] || '');
                    setSelectedLanguage('py');
                }
            }

            setIsLoading(false);
        };

        loadCode();
    }, [searchParams]);

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
    };

    const currentExtensions =
        selectedLanguage && languageExtensions[selectedLanguage]
            ? languageExtensions[selectedLanguage]
            : [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading code...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden">
            <div className='grid grid-cols-1 lg:grid-cols-4 h-full w-full'>
                <div className='w-full h-[50vh] lg:h-full lg:col-span-3'>
                    <CodeShare
                        code={code || ''}
                        onChange={handleCodeChange}
                        extensions={currentExtensions}
                        isOutSourcedScreen={true}
                    />
                </div>

                <div className='w-full h-[50vh] lg:h-full lg:col-span-1 overflow-y-auto bg-white dark:bg-zinc-950 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800'>
                    <div className='flex flex-col h-full p-6 lg:p-8'>
                        <div className='bg-orange-50 dark:bg-zinc-900 border border-orange-200 dark:border-zinc-800 flex flex-col justify-center items-center p-6 rounded-xl shadow-sm'>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="text-zinc-500 dark:text-zinc-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Note</p>
                                </TooltipContent>
                            </Tooltip>

                            <p className='text-center my-6 font-medium text-zinc-600 dark:text-zinc-300 text-sm lg:text-base leading-relaxed'>
                                Other features will only appear when you share a session. Please click on the button below to share and debug in real time!
                            </p>
                            <div className="w-full flex justify-center">
                                <CreateRoomDialog
                                    session={session}
                                    isOutSourced={true}
                                    outSourcedCode={code}
                                    outSourcedLanguage={selectedLanguage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
