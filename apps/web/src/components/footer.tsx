import { railwayFont, sekuyaFont } from "@/app/layout"
import { Github, Linkedin, Mail, X } from "lucide-react"

function Footer() {
  return (
    <div className="min-h-[43vh] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="border-[#967e45] rounded-2xl sm:rounded-3xl px-6 sm:px-8 md:px-10 lg:px-12 py-8 sm:py-10 md:py-12 border-2 shadow-xl/100 shadow-[#BD9267]">
        <p
          className={`${railwayFont.className} font-bold mt-0 text-black dark:text-[#CDCDCD] leading-2 tracking-wide text-sm sm:text-base`}
        >
          PAIRCODE.LIVE
        </p>
        <p
          className={`${railwayFont.className} font-medium mt-4 sm:mt-5 md:mt-6 text-black dark:text-[#CDCDCD] leading-relaxed tracking-wide text-xs sm:text-sm md:text-base`}
        >
          DEBUG, INTERVIEW, PLAN
          <br />
          <br className="hidden sm:block" />
          IN REALTIME
        </p>

        <div className="flex justify-between flex-col sm:flex-row mt-8 sm:mt-10 md:mt-12 lg:mt-14 gap-6 sm:gap-4 items-center sm:items-end">
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

        <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 flex flex-col-reverse sm:flex-row justify-between items-center sm:items-end gap-8 sm:gap-6">
          <div className="flex justify-center gap-8 sm:gap-10 md:gap-12 text-black/60 dark:text-[#BD9267]/80">
            <a
              href="#"
              className="hover:text-[#BD9267] dark:hover:text-[#BD9267] hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              className="hover:text-[#BD9267] dark:hover:text-[#BD9267] hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              className="hover:text-[#BD9267] dark:hover:text-[#BD9267] hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <Github className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a
              href="#"
              className="hover:text-[#BD9267] dark:hover:text-[#BD9267] hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </div>

          <div className="flex justify-center items-center text-center sm:text-right">
            <p className="text-xs sm:text-sm text-black dark:text-[#a7a7a7] leading-relaxed">
              © {new Date().getFullYear()} Bandhan |{" "}
              <a href="https://bandhanmajumder.com" className="hover:underline hover:text-[#BD9267] transition-colors">
                @bandhan
              </a>{" "}
              |{" "}
              <a href="/terms-and-services" className="hover:underline hover:text-[#BD9267] transition-colors">
                Terms and Privacy
              </a>{" "}
              |{" "}
              <a href="/feedback" className="hover:underline hover:text-[#BD9267] transition-colors">
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