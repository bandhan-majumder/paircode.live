"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { trpc } from "@/lib/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Other" as "Bug Report" | "Feature Request" | "General Feedback" | "Other",
    content: "",
  });

  // tRPC call
  const createMutation = useMutation(
    trpc.feedback.create.mutationOptions({
      onSuccess: () => {
        toast.success("Feedback submitted successfully!");
        setFormData({
          name: "",
          email: "",
          category: "Other",
          content: "",
        });
        setSubmitted(true);
      },
      onError: (error) => {
        toast.error(error?.message ?? 'Failed to submit feedback. Please try again.');
      }
    }),
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value as "Bug Report" | "Feature Request" | "General Feedback" | "Other",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate({
      name: formData.name,
      email: formData.email,
      category: formData.category,
      content: formData.content,
    });
  };

  return !submitted ? <Card>
      <CardHeader>
        <CardTitle>Feedback Form</CardTitle>
        <CardDescription>
          Let us know what you think. Your feedback helps us improve.
        </CardDescription>
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
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="border-border">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bug Report">Bug Report</SelectItem>
                <SelectItem value="Feature Request">Feature Request</SelectItem>
                <SelectItem value="General Feedback">
                  General Feedback
                </SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Your Feedback
            </label>
            <Textarea
              id="content"
              name="content"
              placeholder="Tell us what's on your mind..."
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              className="border-border resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button
              disabled={createMutation.isPending}
              type="submit"
              className="flex-1 bg-[#BD9267] hover:bg-[#a0815a] text-white"
            >
              Send Feedback
            </Button>
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                disabled={createMutation.isPending}
                className="w-full border-border bg-transparent"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card> : <p className="text-center text-muted-foreground">Feedback submitted successfully!</p>
  
}
