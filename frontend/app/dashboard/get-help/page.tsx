"use client"

import { useState } from "react"
import {
  Search,
  Mail,
  Book,
  MessageCircle,
  FileQuestion,
  Send,
  HelpCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function HelpPage() {
  const [query, setQuery] = useState("")

  return (
    <div className="w-full min-h-screen bg-background p-6">
      {/* 🔹 Outer Wrapper Card */}
      <Card className=" mx-auto shadow-sm border-border/60">
        <CardHeader className="pb-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-primary">
              <HelpCircle className="h-6 w-6" />
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Get Help & Support
              </h1>
            </div>
            <CardDescription className="max-w-2xl">
              Find answers, connect with support, or explore documentation for your Sales Admin Dashboard.
            </CardDescription>
          </div>
        </CardHeader>

        <Separator />

        {/* 🔍 Search */}
        <CardContent className="pt-8">
          <div className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for help topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-11 text-base"
              />
            </div>
          </div>

          {/* 🧩 Help Sections */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

             <Card className="hover:shadow-md transition-all border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <CardTitle>Tutorials</CardTitle>
                </div>
                <CardDescription>
                  Follow step-by-step guides to learn advanced dashboard tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Watch Tutorials
                </Button>
              </CardContent>
            </Card>


            {/* FAQ */}
            <Card className="hover:shadow-md transition-all border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <FileQuestion className="h-5 w-5 text-primary" />
                  <CardTitle>FAQs</CardTitle>
                </div>
                <CardDescription>
                  Quick answers to the most common dashboard and analytics questions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View FAQs
                </Button>
              </CardContent>
            </Card>

            {/* Documentation */}
            <Card className="hover:shadow-md transition-all border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Book className="h-5 w-5 text-primary" />
                  <CardTitle>Documentation</CardTitle>
                </div>
                <CardDescription>
                  Explore guides, integrations, and API references for the admin panel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Read Docs
                </Button>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="hover:shadow-md transition-all border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <CardTitle>Contact Support</CardTitle>
                </div>
                <CardDescription>
                  Can’t find what you need? Reach out to our support team directly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Contact Team
                </Button>
              </CardContent>
            </Card>

            {/* Tutorials */}
            <Card className="hover:shadow-md transition-all border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <CardTitle>Tutorials</CardTitle>
                </div>
                <CardDescription>
                  Follow step-by-step guides to learn advanced dashboard tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Watch Tutorials
                </Button>
              </CardContent>
            </Card>

            {/* Feedback */}
            <Card className="hover:shadow-md transition-all border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Send className="h-5 w-5 text-primary" />
                  <CardTitle>Send Feedback</CardTitle>
                </div>
                <CardDescription>
                  Share your experience and help us improve the Sales Admin Dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Give Feedback
                </Button>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-10" />

          {/* 💌 Footer Section */}
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Still need assistance?
            </p>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
