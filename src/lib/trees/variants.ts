import type { TreeVariantMeta } from "./types";
import { V_GENERAL, V_BINARY, V_BST } from "./variants-1";
import { V_AVL, V_RB, V_BTREE, V_BPLUS } from "./variants-2";
import { V_TRIE, V_SEGMENT, V_FENWICK } from "./variants-3";

/**
 * Ordered list of tree variants — controls sidebar order under the
 * "Variants" divider. Add new variants (Splay, Treap, KD-Tree, Suffix Tree…)
 * by pushing them to this array — the splat route and course registration
 * pick them up automatically.
 */
export const TREE_VARIANTS: TreeVariantMeta[] = [
  V_GENERAL,
  V_BINARY,
  V_BST,
  V_AVL,
  V_RB,
  V_BTREE,
  V_BPLUS,
  V_TRIE,
  V_SEGMENT,
  V_FENWICK,
];
