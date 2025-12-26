import Image from "next/image";

export default function HeroSectionMobile() {
  return (
    <section className="max-w-[90vw] overflow-hidden">
      <div className="mb-8 flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 mt-4">
            <Image src="/pair.png" width={140} height={140} alt="" />
            <Image src="/code.png" width={170} height={170} alt="" />
        </div>
      </div>
    </section>
  );
}