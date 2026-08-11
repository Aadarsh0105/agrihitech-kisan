import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDownRightIcon, ArrowUpRightIcon, BadgeCheckIcon, FolderTreeIcon, LandmarkIcon, NewspaperIcon, PackageIcon, StoreIcon, UserPlusIcon, UsersIcon, BoxIcon } from "lucide-react";
import { cn } from "../../utils/cn";
import { formatNumber } from "../../utils/format";
import { StatCardData } from "../../data/dashboard";
const icons: Record<StatCardData['icon'], BoxIcon> = {
  package: PackageIcon,
  folder: FolderTreeIcon,
  badge: BadgeCheckIcon,
  store: StoreIcon,
  userPlus: UserPlusIcon,
  users: UsersIcon,
  news: NewspaperIcon,
  landmark: LandmarkIcon
};
export function StatCard({
  stat,
  index = 0



}: {stat: StatCardData;index?: number;}) {
  const Icon = icons[stat.icon];
  const positive = stat.delta >= 0;
  return <motion.div initial={{
    opacity: 0,
    y: 8
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.25,
    delay: index * 0.03,
    ease: [0.16, 1, 0.3, 1]
  }}>
      <Link to={stat.path} className="group block rounded-lg border border-border bg-surface p-4 shadow-card transition-colors hover:border-primary/40">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-subtle text-primary">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
        <p className="mt-2.5 text-2xl font-semibold tracking-tight text-foreground">
          {formatNumber(stat.value)}
        </p>
        <p className="mt-1.5 flex items-center gap-1 text-[11px]">
          <span className={cn('inline-flex items-center gap-0.5 font-medium', positive ? 'text-success' : 'text-danger')}>
            {positive ? <ArrowUpRightIcon className="h-3 w-3" /> : <ArrowDownRightIcon className="h-3 w-3" />}
            {Math.abs(stat.delta)}%
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </p>
      </Link>
    </motion.div>;
}