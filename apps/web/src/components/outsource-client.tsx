'use client';

import CodeShare from '@/components/code-share';
import { DropdownMenuLanguageCheckboxes } from '@/components/lang-dropdown';
import { authClient } from '@/lib/auth-client';
import { languageExtensions } from '@/lib/languageExtensions';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { defaultCodeSnippets } from '@/lib/defaultCodeSnippets';
import { CreateRoomDialog } from '@/components/create-room-dialog';
import { Hand, Info } from 'lucide-react';
import Link from 'next/link';

export default function OutsourceClient() {
    const searchParams = useSearchParams();
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, isPending } = authClient.useSession();

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
                        toast.warning(`Language "${decodedLang}" not supported. Defaulting to python.`);
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

    if (!isPending && !session) {
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

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
        if (!code || code === defaultCodeSnippets[selectedLanguage]) {
            const newCode = defaultCodeSnippets[language] || "";
            setCode(newCode);
        }
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

    if (!isPending && session) {
        return (
            <div className="flex h-screen w-screen flex-col overflow-hidden">
                <div className='flex justify-between'>
                    <div className='w-[80vw]'>
                        <CodeShare
                            code={code || ''}
                            onChange={handleCodeChange}
                            extensions={currentExtensions}
                        />
                    </div>
                    <div className='w-[20vw] p-10'>
                        <div className='flex flex-col justify-center items-center mb-10'>
                            <p className='text-xl mb-5'>Select your language</p>
                            <DropdownMenuLanguageCheckboxes
                                selectedLanguage={selectedLanguage || ''}
                                onLanguageChange={handleLanguageChange}
                            />
                        </div>
                        <div className='bg-red-50 dark:bg-gray-600 flex flex-col justify-center items-center border border-black p-10 mt-10'>
                            <Info />
                            <p className='text-center my-5'>Videos only appear when you share a session. Please click on the button below to share and debug in real time!</p>
                            {!isPending && session && <CreateRoomDialog session={session} isOutSourced={true} outSourcedCode={code} outSourcedLanguage={selectedLanguage} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
