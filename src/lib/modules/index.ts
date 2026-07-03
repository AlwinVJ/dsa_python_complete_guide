import type { RichModule } from "@/lib/module-schema";
import { LINKED_LISTS } from "./linked-lists";

export const RICH_MODULES: Record<string, RichModule> = {
  [LINKED_LISTS.slug]: LINKED_LISTS,
};

export function getRichModule(slug: string): RichModule | undefined {
  return RICH_MODULES[slug];
}
