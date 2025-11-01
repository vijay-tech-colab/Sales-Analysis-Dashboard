"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="p-6">
      <Card className="border-border/60 shadow-sm hover:shadow-md transition-all duration-200 bg-muted/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            Customers / Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm leading-relaxed">
          This section displays customer feedback, satisfaction scores, and recent reviews.
        </CardContent>
      </Card>
    </div>
  )
}
