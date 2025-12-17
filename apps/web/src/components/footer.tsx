import { railwayFont, sekuyaFont } from "@/app/layout"
import { Github, Linkedin, Mail, X } from "lucide-react"

function Footer() {
  return (
    <div className="min-h-[43vh] px-4 sm:px-6 md:px-10 lg:px-15">
      <div className="border-[#967e45] rounded-3xl px-4 sm:px-6 md:px-8 lg:px-5 py-6 md:py-4 border-2 shadow-xl/100 shadow-[#BD9267]">
        <p
          className={`${railwayFont.className} font-bold mt-6 md:mt-10 text-black dark:text-[#CDCDCD] leading-2 tracking-wide text-sm sm:text-base`}
        >
          PAIRCODE.LIVE
        </p>
        <p
          className={`${railwayFont.className} font-medium mt-3 sm:mt-4 md:mt-5 text-black dark:text-[#CDCDCD] leading-2 tracking-wide text-xs sm:text-sm md:text-base`}
        >
          DEBUG, INTERVIEW, PLAN
          <br />
          <br className="hidden md:block" />
          <br className="hidden md:block" />
          IN REALTIME
        </p>

        <div className="flex justify-between flex-col sm:flex-row mt-6 sm:mt-8 md:mt-10 gap-4 sm:gap-0 items-center sm:items-end">
          <div
            className={`${sekuyaFont.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-[#BD9267] italic tracking-tight`}
          >
            {"<p/>"}
          </div>
          <div
            className={`${sekuyaFont.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl text-[#BD9267] tracking-tight`}
          >
            PAIRCODE
          </div>
        </div>

        <div className="mt-8 sm:mt-10 md:mt-15 flex flex-col-reverse sm:flex-row justify-between gap-6 sm:gap-4">
          <div className="flex justify-center gap-6 sm:gap-8 md:gap-10 text-black/60 dark:text-[#BD9267]/80">
            <a
              href="#"
              className="hover:text-[#BD9267] dark:hover:text-[#BD9267] hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <Linkedin size={20} className="sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              className="hover:text-[#BD9267] dark:hover:text-[#BD9267] hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              className="hover:text-[#BD9267] dark:hover:text-[#BD9267] hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <Github size={20} className="sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              className="hover:text-[#BD9267] dark:hover:text-[#BD9267] hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <Mail size={20} className="sm:w-6 sm:h-6" />
            </a>
          </div>

          <div className="flex justify-center items-center text-center sm:text-right">
            <p className="text-xs sm:text-sm text-black dark:text-[#a7a7a7] leading-relaxed">
              © {new Date().getFullYear()} Bandhan |{" "}
              <a href="https://bandhanmajumder.com" className="hover:underline">
                @bandhan
              </a>{" "}
              |{" "}
              <a href="/terms-and-services" className="hover:underline">
                Terms and Privacy
              </a>{" "}
              |{" "}
              <a href="/feedback" className="hover:underline">
                Feedback
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer