import { railwayFont, sekuyaFont } from '@/app/layout'
import { Github, Linkedin, Mail, X } from 'lucide-react'
import React from 'react'

function Footer() {
    return (
        <div className='min-h-[43vh] px-15'>
            <div className='border-[#967e45] rounded-t-3xl px-5 py-4 border-2'>
                <p className={`${railwayFont.className} font-bold mt-10 text-black dark:text-[#CDCDCD] leading-2 tracking-wide`}>PAIRCODE.LIVE</p>
                <p className={`${railwayFont.className} font-medium mt-5 text-black dark:text-[#CDCDCD] leading-2 tracking-wide`}>DEBUG, INTERVIEW, PLAN<br /><br /><br />IN REALTIME</p>
                <div className='flex justify-between flex-row mt-10'>
                    <div className={`${sekuyaFont.className} text-9xl text-[#BD9267] italic tracking-tight`}>{'<p/>'}</div>
                    <div className={`${sekuyaFont.className} text-9xl text-[#BD9267] wider tracking-tight`}>PAIRCODE</div>
                </div>
                <div className='mt-15 flex justify-between'>
                    <div className='flex justify-center items-center flex-col'>
                        <div className='flex justify-between gap-10 dark:text-[#BD9267]'>
                            <Linkedin size={20} />
                            <X size={20} />
                            <Github size={20} />
                            <Mail size={20} />
                        </div>
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                        <p className='text-black dark:text-[#a7a7a7]'>© {new Date().getFullYear()} Bandhan | <a href='https://bandhanmajumder.com'>@bandhan</a> | <a href='/terms-and-services'>Terms and Privacy</a> | <a href='/feedback'>Feedback</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer