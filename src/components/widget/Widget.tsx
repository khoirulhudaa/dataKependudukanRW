// import Card from "components/card";

// const Widget = (props: {
//   icon: JSX.Element;
//   title: string;
//   subtitle: string;
// }) => {
//   const { icon, title, subtitle } = props;
//   return (
//     <Card extra="!flex-row flex-grow items-center rounded-[20px]">
//       <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
//         <div className="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
//           <span className="flex items-center text-blue-500 dark:text-white">
//             {icon}
//           </span>
//         </div>
//       </div>

//       <div className="h-50 ml-4 flex w-auto flex-col justify-center">
//         <p className="font-dm text-sm font-medium text-gray-600">{title}</p>
//         <h4 className="text-xl font-bold text-navy-700 dark:text-white">
//           {subtitle}
//         </h4>
//       </div>
//     </Card>
//   );
// };

// export default Widget;

// components/widget/Widget.tsx (atau path sesuai project kamu)

import Card from "components/card";
import React from "react";

interface WidgetProps {
  icon: JSX.Element;
  title: string;
  subtitle: string | number;
  extraClass?: string;
  onClick?: () => void; // ← PROPS BARU: fungsi yang dipanggil saat diklik
}

const Widget: React.FC<WidgetProps> = ({
  icon,
  title,
  subtitle,
  extraClass = "",
  onClick,
}) => {
  return (
    <Card
      extra={`!flex-row flex-grow items-center rounded-[20px] transition-all duration-200 ${
        onClick
          ? "cursor-pointer hover:shadow-2xl hover:-translate-y-1 hover:bg-brand-50/50 dark:hover:bg-navy-700/80"
          : ""
      } ${extraClass}`}
      onClick={onClick} // ← terapkan onClick ke Card
    >
      <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
        <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 p-3 dark:bg-navy-700">
          <span className="flex items-center text-white dark:text-white">
            {icon}
          </span>
        </div>
      </div>

      <div className="h-50 ml-4 flex w-auto flex-col justify-center">
        <p className="text-lg font-bold text-black">{title}</p>
        <h4 className="text-lg font-normal text-black dark:text-white">
          {subtitle}
        </h4>
      </div>
    </Card>
  );
};

export default Widget;