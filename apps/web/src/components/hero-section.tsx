export default function HeroSection() {
  return (
    <section className="max-w-[90vw] overflow-hidden">
      <div className="mb-8 flex items-center justify-center">
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
    </section>
  );
}