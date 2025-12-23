import { Card } from "@/components/ui/card"

interface Feedback {
  id: number
  name: string
  role: string
  content: string
  avatar: string
}

const customerFeedbacks: Feedback[] = [
  {
    id: 1,
    name: "Akash Mittal",
    role: "Developer",
    content: "Never experienced like this before!",
    avatar: "https://imgs.search.brave.com/bFLognz8LKvfSIVGMCA9iDAe-sPzUV9Q75VbR-Jxa68/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzYyLzAx/LzBkLzYyMDEwZDg0/OGI3OTBhMjMzNmQx/NTQyZmNkYTUxNzg5/LmpwZw",
  },
  {
    id: 2,
    name: "Sudhir Malai",
    role: "Software Engineer",
    content: "Super. Would love to see more features on this!",
    avatar: "https://imgs.search.brave.com/bFLognz8LKvfSIVGMCA9iDAe-sPzUV9Q75VbR-Jxa68/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzYyLzAx/LzBkLzYyMDEwZDg0/OGI3OTBhMjMzNmQx/NTQyZmNkYTUxNzg5/LmpwZw",
  },
  {
    id: 3,
    name: "Anonymous user",
    role: "Designer",
    content: "The UI is clean.",
    avatar: "https://imgs.search.brave.com/bFLognz8LKvfSIVGMCA9iDAe-sPzUV9Q75VbR-Jxa68/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzYyLzAx/LzBkLzYyMDEwZDg0/OGI3OTBhMjMzNmQx/NTQyZmNkYTUxNzg5/LmpwZw",
  },
  {
    id: 4,
    name: "Anonymous user",
    role: "Developer & Student",
    content: "VSCode support made it so easy. Super experience",
    avatar: "https://imgs.search.brave.com/bFLognz8LKvfSIVGMCA9iDAe-sPzUV9Q75VbR-Jxa68/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzYyLzAx/LzBkLzYyMDEwZDg0/OGI3OTBhMjMzNmQx/NTQyZmNkYTUxNzg5/LmpwZw",
  }
]

export function FeedbackCarousel() {
  const allFeedbacks = [...customerFeedbacks, ...customerFeedbacks]

  return (
    <div className="w-full overflow-hidden bg-[#F4F4F4] dark:bg-background py-8 sm:py-10 md:py-12 rounded-2xl sm:rounded-3xl md:rounded-4xl">
      <div className="relative flex items-center">
        <div className="absolute left-0 top-0 z-10 h-full w-8 sm:w-12 bg-gradient-to-r from-[#F4F4F4] dark:from-background to-transparent pointer-events-none" />

        <div className="flex animate-scroll gap-4 sm:gap-6 px-2 sm:px-1" style={{ touchAction: 'none' }}>
          {allFeedbacks.map((feedback, index) => (
            <Card
              key={`${feedback.id}-${index}`}
              className="flex flex-col justify-between w-72 sm:w-80 md:w-[340px] p-5 sm:p-6 bg-card border-border hover:shadow-lg transition-shadow duration-300"
            >
              <p className="text-card-foreground mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base">
                {feedback.content}
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={feedback.avatar || "/placeholder.svg"}
                  alt={feedback.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  crossOrigin="anonymous"
                />
                <div>
                  <p className="font-semibold text-card-foreground text-sm sm:text-base">
                    {feedback.name}
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {feedback.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="absolute right-0 top-0 z-10 h-full w-8 sm:w-12 bg-gradient-to-l from-[#F4F4F4] dark:from-background to-transparent pointer-events-none" />
      </div>
    </div>
  )
}