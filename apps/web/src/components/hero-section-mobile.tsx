export default function HeroSectionMobile() {
  const pairLines = [
    ['██████╗ ', ' █████╗ ', '██╗', '██████╗ '],
    ['██╔══██╗', '██╔══██╗', '██║', '██╔══██╗'],
    ['██████╔╝', '███████║', '██║', '██████╔╝'],
    ['██╔═══╝ ', '██╔══██║', '██║', '██╔══██╗'],
    ['██║     ', '██║  ██║', '██║', '██║  ██║'],
    ['╚═╝     ', '╚═╝  ╚═╝', '╚═╝', '╚═╝  ╚═╝']
  ];
  const codeLines = [
    [' ██████╗ ', '██████╗ ', '██████╗ ', '███████╗'],
    ['██╔════╝', '██╔═══██╗', '██╔══██╗', '██╔════╝'],
    ['██║     ', '██║   ██║', '██║  ██║', '█████╗  '],
    ['██║     ', '██║   ██║', '██║  ██║', '██╔══╝  '],
    ['╚██████╗', '╚██████╔╝', '██████╔╝', '███████╗'],
    [' ╚═════╝', ' ╚═════╝ ', '╚═════╝ ', '╚══════╝']
  ];

  const AsciiWord = ({ lines }: any) => (
    <div className="flex flex-col">
      {lines.map((line: any, lineIndex: any) => (
        <div key={lineIndex} className="flex flex-row">
          {line.map((char: any, charIndex: any) => (
            <span key={charIndex} className="whitespace-pre ascii-art">
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );

  return (
     <section>
        <div className="mb-8 flex items-center justify-center">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-4">
            <div className="text-[#BD9267] text-[8px] xs:text-[10px] sm:text-xs md:text-sm">
              <AsciiWord lines={pairLines} />
            </div>

            <div className="text-[#BD9267] text-[8px] xs:text-[10px] sm:text-xs md:text-sm">
              <AsciiWord lines={codeLines} />
            </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-center text-xl sm:text-2xl font-bold text-balance">
            Do pair programming, on a video call.
          </h1>
        </div>
      </section>
  );
}