"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import axios from "axios"
import type { feedBackFormType } from "@/types/feedback.type"
import { useRouter } from "next/navigation"

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<feedBackFormType>({
    name: "",
    email: "",
    category: "Other",
    message: "",
  })
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as feedBackFormType["category"],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    
    await axios.post("/api/feedback", {
      name: formData.name,
      email: formData.email,
      category: formData.category,
      message: formData.message,
    })

    // redirect to the home page
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border">
        <div className="container mx-auto max-w-2xl px-4 py-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              ← Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-[#BD9267]">Send Us Your Feedback</h1>
          <p className="text-muted-foreground mt-2">We value your thoughts and suggestions</p>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-12">
        {submitted ? (
          <Card className="border-2 border-[#BD9267]">
            <CardContent className="pt-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-[#BD9267] mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                We've received your feedback and appreciate you taking the time to share your thoughts with us.
              </p>
              <p className="text-sm text-muted-foreground">Redirecting you back home...</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Feedback Form</CardTitle>
              <CardDescription>Let us know what you think. Your feedback helps us improve.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-border"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-border"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Feedback Category
                  </label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bug Report">Bug Report</SelectItem>
                      <SelectItem value="Feature Request">Feature Request</SelectItem>
                      <SelectItem value="General Feedback">General Feedback</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Your Feedback
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="border-border resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-[#BD9267] hover:bg-[#a0815a] text-white">
                    Send Feedback
                  </Button>
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full border-border bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}