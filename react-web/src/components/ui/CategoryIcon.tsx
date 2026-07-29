import React from "react";
import { Sprout, Leaf, Bug, SprayCan, Shield, Flower2, Recycle, Tractor, Wheat, TestTube, BadgeCheck, Store, Sparkles, Search, Languages, MapPin, BoxIcon } from "lucide-react";
const map: Record<string, BoxIcon> = {
  sprout: Sprout,
  leaf: Leaf,
  bug: Bug,
  'spray-can': SprayCan,
  shield: Shield,
  'flower-2': Flower2,
  recycle: Recycle,
  tractor: Tractor,
  wheat: Wheat,
  'test-tube': TestTube,
  'badge-check': BadgeCheck,
  store: Store,
  sparkles: Sparkles,
  search: Search,
  languages: Languages,
  'map-pin': MapPin
};
export function CategoryIcon({
  name,
  className



}: {name: string;className?: string;}) {
  const Icon = map[name] ?? Leaf;
  return <Icon className={className} aria-hidden />;
}