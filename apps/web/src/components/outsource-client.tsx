'use client';

import CodeShare from '@/components/code-share';
import { languageExtensions } from '@/lib/languageExtensions';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { defaultCodeSnippets } from '@/lib/defaultCodeSnippets';
import { CreateRoomDialog } from '@/components/create-room-dialog';
import { Hand, Info } from 'lucide-react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface OutsourceClientProps {
    session: any;
}

export default function OutsourceClient({ session }: OutsourceClientProps) {
    const searchParams = useSearchParams();
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCode = async () => {
            const source = searchParams.get('source');

            if (source === 'clipboard') {
                try {
                    // get clipboard permission
                    await navigator.permissions.query({ name: 'persistent-storage' });
                    const clipboardText = await navigator.clipboard.readText();
                    const sessionData = JSON.parse(clipboardText);

                    setCode(sessionData.code || '');
                    setSelectedLanguage(sessionData.language || 'python');

                    toast.success('Code imported from VS Code!');
                } catch (error) {
                    console.error('Failed to read clipboard:', error);
                    toast.error('Failed to read code from clipboard. Please paste manually or grant clipboard permission.');

                    const lang = searchParams.get('language');
                    if (lang) {
                        setSelectedLanguage(decodeURIComponent(lang));
                    }
                }
            }
            else {
                const outSourcedCode = searchParams.get('code');
                const outSourcedCodeLang = searchParams.get('language');

                if (outSourcedCode && outSourcedCodeLang) {
                    const decodedCode = decodeURIComponent(outSourcedCode);
                    const decodedLang = decodeURIComponent(outSourcedCodeLang);

                    setCode(decodedCode);

                    if (defaultCodeSnippets[decodedLang]) {
                        setSelectedLanguage(decodedLang);
                        toast.success('Code imported from VS Code!');
                    } else {
                        setSelectedLanguage('python');
                        toast.warning('Language extension is not supported. Falling back to default');
                    }
                } else {
                    // No code provided
                    setCode(defaultCodeSnippets['python'] || '');
                    setSelectedLanguage('python');
                }
            }

            setIsLoading(false);
        };

        loadCode();
    }, [searchParams]);

    if (!session) {
        return (
            <div className='flex justify-center items-center flex-col h-screen'>
                <Hand size={50} className='mb-3' />
                <p className='text-2xl tracking-tighter'>To be able to share and collaborate code, you must login.</p>
                <p className='text-2xl tracking-tighter'>Click <Link className='text-[#BD9267] underline' href={'/login'}>here</Link> to login. Once done, please share with pair code again : {')'}</p>
            </div>
        )
    }

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

    if (session) {
        return (
            <div className="flex h-screen w-screen flex-col overflow-hidden">
                <div className='flex justify-between'>
                    <div className='w-[80vw]'>
                        <CodeShare
                            code={code || ''}
                            onChange={handleCodeChange}
                            extensions={currentExtensions}
                            isOutSourcedScreen={true}
                        />
                    </div>
                    <div className='w-[20vw] p-10'>
                        <div className='bg-orange-100 dark:bg-gray-700 border-2 border-gray-800 dark:border-amber-50 flex flex-col justify-center items-center p-10 mt-10 rounded-4xl'>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Note</p>
                                </TooltipContent>
                            </Tooltip>

                            <p className='text-center my-5 font-semibold'>Other features will only appear when you share a session. Please click on the button below to share and debug in real time!</p>
                            {session && <CreateRoomDialog session={session} isOutSourced={true} outSourcedCode={code} outSourcedLanguage={selectedLanguage} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
