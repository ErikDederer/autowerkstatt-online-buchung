import { Clock } from "lucide-react";
import { siteConfig, type OpeningHoursRow } from "@/lib/site-config";

export type OpeningHoursTableProps = {
  title?: string;
  rows?: OpeningHoursRow[];
  className?: string;
};

export function OpeningHoursTable({
  title = "Öffnungszeiten",
  rows = [...siteConfig.openingHours],
  className,
}: OpeningHoursTableProps) {
  return (
    <div className={className}>
      <h3 className="flex items-center gap-2 font-heading text-lg font-semibold">
        <Clock className="size-5 text-primary" aria-hidden="true" />
        {title}
      </h3>
      <table className="mt-4 w-full text-sm">
        <caption className="sr-only">{title}</caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.days} className="border-b last:border-0">
              <th scope="row" className="py-2 pr-4 text-left font-medium">
                {row.days}
              </th>
              <td className="py-2 text-right text-muted-foreground">
                {row.hours}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
