import { ModeToggle } from "./mode-toggle"
import { Github, Linkedin, Mail } from "lucide-react"
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link"
import type { UrlObject } from "url";

function Footer() {
  const footerLinks = {
    products: [
      { label: "PairCoding site", href: "/" },
      { label: "PairCode Extension", href: "https://marketplace.visualstudio.com/items?itemName=BandhanMajumder.paircode" }
    ],
    solutions: [
      { label: "Interviews", href: "#" },
      { label: "Debugging solutions", href: "#" },
      { label: "Brainstorming ideas", href: "#" },
      { label: "Coding challenges", href: "#" }
    ],
    developers: [
      { label: "Contributing", href: "https://github.com/bandhan-majumder/paircode.live/contributing.md" },
      { label: "Open Source", href: "https://github.com/bandhan-majumder/paircode.live" },
    ],
    company: [
      { label: "Terms and Services", href: "/terms-and-services" },
      { label: "Feedback", href: "/feedback" },
      { label: "Support", href: "mailto:support@paircode.com?cc=bandhanmajumder16@gmail.com&subject=Message%20from%20User&body=Hey%20Team%2C%0AGood%20morning%0A%0Ayours%20truely%0Auser" },
    ],
  }

  return (
    <footer className="text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex sm:justify-between sm:flex-row flex-col gap-8 mb-12">
          <div className="flex flex-col gap-5">
            <div className="flex justify-start gap-2">
              {/* <div>
              {'</p>'}
            </div> */}
              <div className="text-black dark:text-white font-semibold text-xl">
                PAIRCODE
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="https://twitter.com/MEbandhan" className="hover:text-black dark:hover:text-white transition-colors">
                <FaXTwitter size={20} />
              </Link>
              <Link href="https://github.com/bandhan-majumder/paircode.live" className="hover:text-black dark:hover:text-white transition-colors">
                <Github size={20} />
              </Link>
              <Link href="https://linkedin.com/in/bandhan-majumder" className="hover:text-black dark:hover:text-white transition-colors">
                <Linkedin size={20} />
              </Link>
              <Link href="mailto:bandhan@paircode.com?cc=bandhanmajumder16@gmail.com&subject=Message%20from%20User&body=Hey%20Bandhan%2C%0AGood%20morning%0A%0Ayours%20truely%0Auser" className="hover:text-black dark:hover:text-white transition-colors">
                <Mail size={20} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 smd:gap-15 md:gap-20">
            <div>
              <h3 className="text-black dark:text-white font-medium mb-4">Products</h3>
              <ul className="space-y-3">
                {footerLinks.products.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href as unknown as UrlObject} className="text-sm hover:text-black dark:hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-black dark:text-white font-medium mb-4">Solutions</h3>
              <ul className="space-y-3">
                {footerLinks.solutions.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href as unknown as UrlObject} className="text-sm hover:text-black dark:hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-black dark:text-white font-medium mb-4">Developers</h3>
              <ul className="space-y-3">
                {footerLinks.developers.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href as unknown as UrlObject} className="text-sm hover:text-black dark:hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-black dark:text-white font-medium mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href as unknown as UrlObject} className="text-sm hover:text-black dark:hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">© PAIR CODE</p>
          <ModeToggle />
        </div>
      </div>
    </footer>
  )
}

export default Footer