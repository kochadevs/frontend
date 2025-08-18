import { Button } from "@/components/ui/button";
import HorizontalPostScroller from "./HorizontalPostScroller";
import { Card } from "@/components/ui/card";

 const posts = [
   {
     id: "1",
     author: {
       name: "Olivia Rhye",
       role: "Social Media Influencer",
       avatar:
         "https://images.unsplash.com/photo-1637722598283-65ba2bb46734?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     },
     timeAgo: "14h ago",
     content:
       "Pro tip for fellow tech reviewers: I've found that consistency is key to growing as an influencer. It's not always about big numbers, but about staying true to your passion and connecting with your audience. Keep pushing forward and trust the process. Every post is progress.",
     image:
       "https://plus.unsplash.com/premium_photo-1675791727728-f829fde51f70?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     likes: {
       count: 3,
       avatars: [
         "https://github.com/shadcn.png",
         "https://github.com/leerob.png",
         "https://github.com/evilrabbit.png",
       ],
     },
     comments: 4,
     reposts: 5,
   },
   {
     id: "2",
     author: {
       name: "Olivia Rhye",
       role: "Social Media Influencer",
       avatar:
         "https://images.unsplash.com/photo-1637722598283-65ba2bb46734?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     },
     timeAgo: "14h ago",
     content:
       "Pro tip for fellow tech reviewers: I've found that consistency is key to growing as an influencer. It's not always about big numbers, but about staying true to your passion and connecting with your audience. Keep pushing forward and trust the process. Every post is progress.",
     image:
       "https://plus.unsplash.com/premium_photo-1675791727728-f829fde51f70?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     likes: {
       count: 3,
       avatars: [
         "https://github.com/shadcn.png",
         "https://github.com/leerob.png",
         "https://github.com/evilrabbit.png",
       ],
     },
     comments: 4,
     reposts: 5,
   },
   {
     id: "3",
     author: {
       name: "Olivia Rhye",
       role: "Social Media Influencer",
       avatar:
         "https://images.unsplash.com/photo-1637722598283-65ba2bb46734?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     },
     timeAgo: "14h ago",
     content:
       "Pro tip for fellow tech reviewers: I've found that consistency is key to growing as an influencer. It's not always about big numbers, but about staying true to your passion and connecting with your audience. Keep pushing forward and trust the process. Every post is progress.",
     image:
       "https://plus.unsplash.com/premium_photo-1675791727728-f829fde51f70?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     likes: {
       count: 3,
       avatars: [
         "https://github.com/shadcn.png",
         "https://github.com/leerob.png",
         "https://github.com/evilrabbit.png",
       ],
     },
     comments: 4,
     reposts: 5,
   },
   {
     id: "4",
     author: {
       name: "Olivia Rhye",
       role: "Social Media Influencer",
       avatar:
         "https://images.unsplash.com/photo-1637722598283-65ba2bb46734?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     },
     timeAgo: "14h ago",
     content:
       "Pro tip for fellow tech reviewers: I've found that consistency is key to growing as an influencer. It's not always about big numbers, but about staying true to your passion and connecting with your audience. Keep pushing forward and trust the process. Every post is progress.",
     image:
       "https://plus.unsplash.com/premium_photo-1675791727728-f829fde51f70?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     likes: {
       count: 3,
       avatars: [
         "https://github.com/shadcn.png",
         "https://github.com/leerob.png",
         "https://github.com/evilrabbit.png",
       ],
     },
     comments: 4,
     reposts: 5,
   },
   {
     id: "5",
     author: {
       name: "Olivia Rhye",
       role: "Social Media Influencer",
       avatar:
         "https://images.unsplash.com/photo-1637722598283-65ba2bb46734?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     },
     timeAgo: "14h ago",
     content:
       "Pro tip for fellow tech reviewers: I've found that consistency is key to growing as an influencer. It's not always about big numbers, but about staying true to your passion and connecting with your audience. Keep pushing forward and trust the process. Every post is progress.",
     image:
       "https://plus.unsplash.com/premium_photo-1675791727728-f829fde51f70?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     likes: {
       count: 3,
       avatars: [
         "https://github.com/shadcn.png",
         "https://github.com/leerob.png",
         "https://github.com/evilrabbit.png",
       ],
     },
     comments: 4,
     reposts: 5,
   },
   {
     id: "6",
     author: {
       name: "Olivia Rhye",
       role: "Social Media Influencer",
       avatar:
         "https://images.unsplash.com/photo-1637722598283-65ba2bb46734?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     },
     timeAgo: "14h ago",
     content:
       "Pro tip for fellow tech reviewers: I've found that consistency is key to growing as an influencer. It's not always about big numbers, but about staying true to your passion and connecting with your audience. Keep pushing forward and trust the process. Every post is progress.",
     image:
       "https://plus.unsplash.com/premium_photo-1675791727728-f829fde51f70?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     likes: {
       count: 3,
       avatars: [
         "https://github.com/shadcn.png",
         "https://github.com/leerob.png",
         "https://github.com/evilrabbit.png",
       ],
     },
     comments: 4,
     reposts: 5,
   },
   {
     id: "7",
     author: {
       name: "Olivia Rhye",
       role: "Social Media Influencer",
       avatar:
         "https://images.unsplash.com/photo-1637722598283-65ba2bb46734?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     },
     timeAgo: "14h ago",
     content:
       "Pro tip for fellow tech reviewers: I've found that consistency is key to growing as an influencer. It's not always about big numbers, but about staying true to your passion and connecting with your audience. Keep pushing forward and trust the process. Every post is progress.",
     image:
       "https://plus.unsplash.com/premium_photo-1675791727728-f829fde51f70?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     likes: {
       count: 3,
       avatars: [
         "https://github.com/shadcn.png",
         "https://github.com/leerob.png",
         "https://github.com/evilrabbit.png",
       ],
     },
     comments: 4,
     reposts: 5,
   },
   // Add more posts as needed
 ];

export default function Posts(){
    return (
      <Card className="gap-0 p-0">
        <header className="flex items-center h-[62px] border-b px-6">
          <h2 className="text-gray-600 font-[600] text-[20px]">Post(s)</h2>
        </header>

        <HorizontalPostScroller posts={posts} />

        <Button
          variant="ghost"
          className="border-y h-[52px] w-full rounded-0 flex items-center justify-center text-gray-700 mt-[2rem]"
        >
          Show all posts
        </Button>
      </Card>
    );
}