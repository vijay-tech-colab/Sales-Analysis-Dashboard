"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IconDownload, IconSearch, IconStar } from "@tabler/icons-react";
import { CSVLink } from "react-csv";
import { motion } from "framer-motion";

export default function CustomerFeedbackPage() {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");

  // 🔹 Random fake data generator
  const sentiments = ["Positive", "Neutral", "Negative"];
  const feedbackSamples = [
    "Great experience! Fast delivery and helpful support.",
    "Product quality could be better.",
    "Absolutely love it! Highly recommend.",
    "Received a damaged product but customer service resolved quickly.",
    "Good prices, but delivery took too long.",
    "Amazing packaging and friendly seller.",
    "Satisfied with my purchase!",
    "Average experience, nothing special.",
    "Terrible quality, not worth the money.",
    "Exceptional customer support experience!",
  ];

  const randomElement = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const fakeFeedback = React.useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => {
      const sentiment = randomElement(sentiments);
      const rating =
        sentiment === "Positive"
          ? Math.floor(Math.random() * 2) + 4 // 4-5 stars
          : sentiment === "Neutral"
          ? Math.floor(Math.random() * 2) + 3 // 3-4 stars
          : Math.floor(Math.random() * 2) + 1; // 1-2 stars
      return {
        id: i + 1,
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        feedback: randomElement(feedbackSamples),
        rating,
        sentiment,
        date: new Date(
          Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30
        ).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        image: `https://i.pravatar.cc/150?img=${i + 5}`,
      };
    });
  }, []);

  const filteredFeedback = React.useMemo(() => {
    return fakeFeedback.filter(
      (f) =>
        (filter === "all" || f.sentiment === filter) &&
        (f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.feedback.toLowerCase().includes(search.toLowerCase()))
    );
  }, [fakeFeedback, search, filter]);

  return (
    <motion.div
      className="space-y-8 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              💬 Customer Feedback
            </CardTitle>
            <CardDescription className="text-gray-500">
              Read what your customers are saying
            </CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative">
              <Input
                placeholder="Search feedback..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64 border-gray-300"
              />
              <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <CSVLink data={filteredFeedback} filename="customer-feedback.csv">
              <Button variant="outline" className="gap-2">
                <IconDownload className="h-4 w-4" /> Export
              </Button>
            </CSVLink>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs for sentiment filter */}
      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Positive">Positive</TabsTrigger>
          <TabsTrigger value="Neutral">Neutral</TabsTrigger>
          <TabsTrigger value="Negative">Negative</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <FeedbackGrid feedbackList={filteredFeedback} />
        </TabsContent>
        <TabsContent value="Positive" className="space-y-4">
          <FeedbackGrid feedbackList={filteredFeedback} />
        </TabsContent>
        <TabsContent value="Neutral" className="space-y-4">
          <FeedbackGrid feedbackList={filteredFeedback} />
        </TabsContent>
        <TabsContent value="Negative" className="space-y-4">
          <FeedbackGrid feedbackList={filteredFeedback} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

// 🧩 Reusable Feedback Card Grid
function FeedbackGrid({
  feedbackList,
}: {
  feedbackList: {
    id: number;
    name: string;
    email: string;
    feedback: string;
    rating: number;
    sentiment: string;
    date: string;
    image: string;
  }[];
}) {
  if (feedbackList.length === 0) {
    return (
      <Card className="p-10 text-center text-gray-500 shadow-sm border-dashed border-gray-200">
        No feedback found.
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {feedbackList.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <Card className="hover:shadow-md transition-all border border-gray-100">
            <CardHeader className="flex flex-row items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                <AvatarImage src={item.image} />
                <AvatarFallback>{item.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-base font-semibold">
                  {item.name}
                </CardTitle>
                <CardDescription>{item.date}</CardDescription>
              </div>
              <div className="ml-auto">
                <Badge
                  variant={
                    item.sentiment === "Positive"
                      ? "default"
                      : item.sentiment === "Neutral"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {item.sentiment}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700 text-sm">{item.feedback}</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <IconStar
                    key={idx}
                    className={`h-4 w-4 ${
                      idx < item.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
