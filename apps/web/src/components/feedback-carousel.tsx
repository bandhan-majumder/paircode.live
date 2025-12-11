import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Feedback {
  id: number
  name: string
  role: string
  content: string
  rating: number
  avatar: string
}

const dummyFeedbacks: Feedback[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Product Manager",
    content: "This product has completely transformed how we work. The attention to detail is incredible.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Software Engineer",
    content: "Outstanding support and documentation. Everything works exactly as promised.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
  },
  {
    id: 3,
    name: "Emma Watson",
    role: "Designer",
    content: "The UI is so intuitive and beautiful. My team loves using it every day.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Startup Founder",
    content: "Best investment we made this year. The ROI has been fantastic and support is amazing.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    role: "Marketing Lead",
    content: "Seamless integration with our existing tools. Saved us so much time and effort.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "CTO",
    content: "The technical architecture is solid and well-documented. Highly recommended for enterprises.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
]

export function FeedbackCarousel() {
  const allFeedbacks = [...dummyFeedbacks, ...dummyFeedbacks]

  return (
    <div className="w-full overflow-hidden bg-[#F4F4F4] dark:bg-background py-12 rounded-4xl">
      <div className="relative flex items-center">
        <div className="absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />

        <div className="flex animate-scroll gap-6 px-6">
          {allFeedbacks.map((feedback, index) => (
            <Card
              key={`${feedback.id}-${index}`}
              className="flex-shrink-0 w-80 p-6 bg-card border-border hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: feedback.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-card-foreground mb-6 leading-relaxed text-sm">{feedback.content}</p>

              <div className="flex items-center gap-3">
                <img
                  src={feedback.avatar || "/placeholder.svg"}
                  alt={feedback.name}
                  className="w-10 h-10 rounded-full"
                  crossOrigin="anonymous"
                />
                <div>
                  <p className="font-semibold text-card-foreground text-sm">{feedback.name}</p>
                  <p className="text-muted-foreground text-xs">{feedback.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
