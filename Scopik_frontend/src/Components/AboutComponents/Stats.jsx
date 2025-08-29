
import { Users, BadgeCheck, BookOpen, User } from "lucide-react";

function Stats() {
  const stats = [
    {
      icon: <Users className="text-[#FF6A00] size-20 mb-2" />,
      title: "12,836",
      subtitle: "Students",
    },
    {
      icon: <BadgeCheck className="text-[#FF6A00] size-20 mb-2" />,
      title: "Certificate",
      subtitle: "Provided",
    },
    {
      icon: <BookOpen className="text-[#FF6A00] size-20 mb-2" />,
      title: "Detailed",
      subtitle: "Classes",
    },
    {
      icon: <User className="text-[#FF6A00] size-20 mb-2" />,
      title: "Professional",
      subtitle: "Staffs",
    },
  ];
  return (
    <div className="py-10 px-4 text-center pt-10 pb-10 bg-white dark:bg-black transition-colors duration-500">
      <h2 className="text-4xl md:text-5xl xl:text-5xl mt-5  font-news text-center text-black dark:text-gray-300">
        Know About The <span className="text-[#F97316]">Scopik</span>
      </h2>

      <div className="grid gap-10 mt-20 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto px-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-[#0D0D0D] border border-gray-300 dark:border-[#1E1E1E] rounded-xl py-10 px-6 shadow-md transition-all duration-300 hover:border-orange-400 hover:shadow-[0_0_20px_4px_#FDBA74] hover:scale-105"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="text-[#FF6A00] text-4xl">{item.icon}</div>
              <h4 className="text-xl font-semibold text-black dark:text-white">
                {item.title}
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Stats;
