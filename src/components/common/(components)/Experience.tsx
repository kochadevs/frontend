import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Experience() {
  return (
    <Card className="w-full gap-0 p-0">
      <div className="px-[48px] mb-2 border-b h-[62px] flex items-center justify-start">
        <h2 className="text-gray-700 text-[20px] font-[600]">Experience</h2>
      </div>
      <div className="px-[48px] flex-col flex gap-2 mt-3">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-start border-b gap-x-3 pb-2">
            <div className="flex items-start space-x-4">
              <Avatar className="w-[32px] h-[32px] object-center">
                <AvatarImage
                  src="/asset/home/mailchimp.png"
                  className="w-full h-full object-cover"
                />
                <AvatarFallback>Icon</AvatarFallback>
              </Avatar>
              <div className="flex-col flex gap-y-1">
                <h2 className="font-semibold text-[#344054] text-[16px] hover:text-[#334AFF] hover:underline cursor-pointer">
                  mailchimp
                </h2>
                <p className="text-gray-500 text-[15px]">1 yr 3 mos</p>
                <p className="text-gray-500 text-[15px]">United states</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full h-[52px]">
        Show all 3 experiences
      </Button>
    </Card>
  );
}