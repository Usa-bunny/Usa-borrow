"use client";

import { Card, CardContent } from "@/components/ui/card";

export function SectionStatistic({
  items,
}: {
  items: { value: string | number; label: string }[];
}) {
  return (
    <div className="w-full px-4 lg:px-6">
      <div className="grid grid-cols-2 max-[30rem]:grid-cols-1 gap-3 lg:flex lg:flex-wrap lg:items-baseline lg:justify-end lg:gap-x-5 lg:gap-y-0">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const valueColor = isFirst
            ? "text-stone-800 dark:text-stone-100"
            : "text-[#5f7464] dark:text-[#7ba183]";

          return (
            <div key={item.label + index} className="w-full lg:w-auto">
              <Card className="lg:hidden">
                <CardContent className="flex items-baseline gap-x-1.5 max-[30rem]:mx-auto">
                  <span
                    className={`font-serif text-2xl font-semibold tabular-nums ${valueColor}`}
                  >
                    {item.value}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 whitespace-nowrap">
                    {item.label}
                  </span>
                </CardContent>
              </Card>

              <div className="hidden lg:flex lg:items-baseline lg:gap-x-1.5">
                <span
                  className={`font-serif text-3xl font-medium tabular-nums ${valueColor}`}
                >
                  {item.value}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
