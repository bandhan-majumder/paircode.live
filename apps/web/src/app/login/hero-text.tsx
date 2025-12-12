import { Shadows_Into_Light } from "next/font/google";

const shadowsIntoLight = Shadows_Into_Light({
  subsets: ["latin"],
  variable: "--font-shadows-into-light",
  weight: "400",
  display: "swap",
});

function LoginHeroText() {
  return (
    <div>
      <p className={`${shadowsIntoLight.className} tracking-widest text-center text-6xl font-bold row-span-1 mb-5 text-[#BD9267]`}>Start your debug journey.</p>
      <p className={`${shadowsIntoLight.className} text-[#BD9267] text-center text-4xl tracking-wide`}>Create Rooms, directly from <span className="relative text-blue-400 font-extrabold underline decoration-wavy decoration-blue-700 underline-offset-4 group-hover:text-blue-300 transition-colors">
        vscode
      </span>{' '}!!</p>
    </div>
  )
}

export default LoginHeroText;