import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <Card className="p-0 overflow-hidden gap-1">
      <div className="w-full h-[63px] flex items-center px-[38px] py-[16px] border-b">
        <h3 className="font-[600] text-[20px] text-[#475467]">About</h3>
      </div>
      <div className="px-[38px] py-[16px]">
        <p className="text-[#344054] font-[400]">
          Hi there! I&apos;m a talented full stack developer primarily focusing
          on backend development at AmaliTech Services. My tech stack includes
          JavaScript, Java, PHP, Node.js, Spring Boot, Laravel, Angular, Reactjs
          and Vuejs.I bring passion and expertise to my backend developer role,
          creating scalable, high-performing, and maintainable systems using
          languages like JavaScript, Java, and PHP and their respective
          frameworks, such as Node.js, Spring Boot, and Laravel.I have extensive
          experience with Laravel, having worked on an Enterprise Resource
          Management System and Java, where I contributed to a robust Payroll
          System. I am dedicated to creating scalable and maintainable backends
          and aspire to become a Java and Spring Boot expert.I enjoy watching
          movies in my free time and am upskilling in Spring Boot microservices.
        </p>
      </div>
    </Card>
  );
}
