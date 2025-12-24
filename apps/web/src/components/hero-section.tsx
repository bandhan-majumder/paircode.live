import Image from "next/image";

export default function HeroSection() {
  return (
    <div>
      <div className="hidden md:block mb-8 flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <pre className="ascii-art text-[#BD9267] text-[10px] xs:text-xs sm:text-sm">
            {`
██████╗  █████╗ ██╗██████╗ 
██╔══██╗██╔══██╗██║██╔══██╗
██████╔╝███████║██║██████╔╝
██╔═══╝ ██╔══██║██║██╔══██╗
██║     ██║  ██║██║██║  ██║
╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝`}
          </pre>

          <pre className="ascii-art text-[#BD9267] text-[10px] xs:text-xs sm:text-sm">
            {`
 ██████╗ ██████╗ ██████╗ ███████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝
██║     ██║   ██║██║  ██║█████╗  
██║     ██║   ██║██║  ██║██╔══╝  
╚██████╗╚██████╔╝██████╔╝███████╗
 ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝`}
          </pre>
        </div>
      </div>

      <div className="flex justify-center items-center md:hidden mb-8">
        <Image src={'https://cdn.jsdelivr.net/gh/bandhan-majumder/paircode.live@main/apps/web/public/paircode-ascii.svg'} width={200} height={200} alt="PairCode" className="z-10 h-auto" />
      </div>

      <div className="text-center">
        <p className='text-center text-2xl sm:text-3xl md:text-4xl font-bold text-balance'>Do pair programming, on a video call.</p>
      </div>
    </div>
  );
}