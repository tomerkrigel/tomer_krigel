import React from "react";

interface TomerImageProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showBadge?: boolean;
}

// התמונה הקבועה של תומר נמצאת ב- public/tomer.jpg
// כדי להחליף אותה בעתיד: פשוט שמרו קובץ חדש באותו שם באותה תיקייה.
const SIZES: Record<string, string> = {
  sm: "w-14 h-14",
  md: "w-22 h-22 sm:w-24 sm:h-24",
  lg: "w-36 h-36 sm:w-40 sm:h-40",
  xl: "w-44 h-44 sm:w-52 sm:h-52",
  full: "w-full h-full",
};

export default function TomerImage({ className = "", size = "md" }: TomerImageProps) {
  const ring = size === "xl" || size === "lg" ? "border-4" : "border-[3px]";
  return (
    <div className={`relative shrink-0 ${SIZES[size] || SIZES.md} ${className}`}>
      {/* הילה זהובה עדינה */}
      <div className="absolute inset-0 rounded-full shadow-[0_0_45px_rgba(201,170,103,0.35)]" />
      {/* טבעת זהב חיצונית דקה - מראה מדליון */}
      <div className="absolute -inset-2 rounded-full border border-[#C9AA67]/40" />
      <img
        src="/tomer.jpg"
        alt="תומר קריגל - מתכנן פיננסי אישי"
        className={`w-full h-full rounded-full object-cover relative ${ring} border-[#C9AA67] shadow-2xl`}
        loading="lazy"
      />
    </div>
  );
}
