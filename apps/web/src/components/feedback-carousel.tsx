import { Card } from "@/components/ui/card"

interface Feedback {
  id: number
  name: string
  role: string
  content: string
  avatar: string
}

const dummyFeedbacks: Feedback[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Product Manager",
    content: "This product has completely transformed how we work. The attention to detail is incredible.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Software Engineer",
    content: "Outstanding support and documentation. Everything works exactly as promised.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    id: 3,
    name: "Emma Watson",
    role: "Designer",
    content: "The UI is so intuitive and beautiful. My team loves using it every day.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Startup Founder",
    content: "Best investment we made this year. The ROI has been fantastic and support is amazing.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    role: "Marketing Lead",
    content: "Seamless integration with our existing tools. Saved us so much time and effort.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "CTO",
    content: "The technical architecture is solid and well-documented. Highly recommended for enterprises.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
]

export function FeedbackCarousel() {
  const allFeedbacks = [...dummyFeedbacks, ...dummyFeedbacks]

  return (
    <div className="w-full overflow-hidden bg-[#F4F4F4] dark:bg-background py-8 sm:py-10 md:py-12 rounded-2xl sm:rounded-3xl md:rounded-4xl">
      <div className="relative flex items-center">
        <div className="absolute left-0 top-0 z-10 h-full w-8 sm:w-12 bg-gradient-to-r from-[#F4F4F4] dark:from-background to-transparent pointer-events-none" />

        <div className="flex animate-scroll gap-4 sm:gap-6 px-2 sm:px-1" style={{ touchAction: 'none' }}>
          {allFeedbacks.map((feedback, index) => (
            <Card
              key={`${feedback.id}-${index}`}
              className="flex-shrink-0 w-72 sm:w-80 md:w-[340px] p-5 sm:p-6 bg-card border-border hover:shadow-lg transition-shadow duration-300"
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