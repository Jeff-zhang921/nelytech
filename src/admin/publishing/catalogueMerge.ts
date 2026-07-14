import type { CatalogueDraft } from "@/lib/adminCatalogueDraft";

export type CatalogueMergeConflict = {
  path: string;
  message: string;
};

export type CatalogueMergeResult = {
  draft: CatalogueDraft;
  conflicts: CatalogueMergeConflict[];
};

const missing = Symbol("missing");
type MergeValue = unknown | typeof missing;

export function rebaseCatalogueDraft(
  base: CatalogueDraft,
  local: CatalogueDraft,
  latest: CatalogueDraft,
): CatalogueMergeResult {
  const conflicts: CatalogueMergeConflict[] = [];
  const merged = mergeValue(base, local, latest, "catalogue", conflicts);

  if (!isRecord(merged) || !Array.isArray(merged.categories)) {
    throw new Error("The catalogue draft could not be rebased safely.");
  }

  return {
    draft: merged as CatalogueDraft,
    conflicts,
  };
}

function mergeValue(
  base: MergeValue,
  local: MergeValue,
  latest: MergeValue,
  path: string,
  conflicts: CatalogueMergeConflict[],
): MergeValue {
  if (local === missing && latest === missing) return missing;

  if (base === missing) {
    if (local === missing) return cloneValue(latest);
    if (latest === missing || valuesEqual(local, latest)) return cloneValue(local);

    addConflict(conflicts, path, "This item was added differently in both versions.");
    return cloneValue(local);
  }

  if (local === missing) {
    if (valuesEqual(base, latest)) return missing;
    addConflict(conflicts, path, "Your draft removed this item while GitHub changed it.");
    return missing;
  }

  if (latest === missing) {
    if (valuesEqual(base, local)) return missing;
    addConflict(conflicts, path, "GitHub removed this item while your draft changed it.");
    return cloneValue(local);
  }

  if (valuesEqual(local, base)) return cloneValue(latest);
  if (valuesEqual(latest, base) || valuesEqual(local, latest)) return cloneValue(local);

  if (Array.isArray(base) && Array.isArray(local) && Array.isArray(latest)) {
    if (isStableIdCollection(base, local, latest)) {
      return mergeStableIdCollection(
        base as Array<Record<string, unknown>>,
        local as Array<Record<string, unknown>>,
        latest as Array<Record<string, unknown>>,
        path,
        conflicts,
      );
    }

    addConflict(conflicts, path, "This list changed in both your draft and GitHub.");
    return cloneValue(local);
  }

  if (isRecord(base) && isRecord(local) && isRecord(latest)) {
    return mergeRecord(base, local, latest, path, conflicts);
  }

  addConflict(conflicts, path, "This value changed in both your draft and GitHub.");
  return cloneValue(local);
}

function mergeRecord(
  base: Record<string, unknown>,
  local: Record<string, unknown>,
  latest: Record<string, unknown>,
  path: string,
  conflicts: CatalogueMergeConflict[],
) {
  const merged: Record<string, unknown> = {};
  const keys = new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(latest)]);

  for (const key of keys) {
    const value = mergeValue(
      key in base ? base[key] : missing,
      key in local ? local[key] : missing,
      key in latest ? latest[key] : missing,
      `${path}.${key}`,
      conflicts,
    );

    if (value !== missing) merged[key] = value;
  }

  return merged;
}

function mergeStableIdCollection(
  base: Array<Record<string, unknown>>,
  local: Array<Record<string, unknown>>,
  latest: Array<Record<string, unknown>>,
  path: string,
  conflicts: CatalogueMergeConflict[],
) {
  const baseById = createIdMap(base);
  const localById = createIdMap(local);
  const latestById = createIdMap(latest);
  const baseIds = base.map(getStableId);
  const localIds = local.map(getStableId);
  const latestIds = latest.map(getStableId);
  const localReordered = hasReorderedExistingItems(baseIds, localIds);
  const latestReordered = hasReorderedExistingItems(baseIds, latestIds);

  let preferredIds = localIds;
  if (!localReordered && latestReordered) preferredIds = latestIds;

  if (
    localReordered &&
    latestReordered &&
    !valuesEqual(existingIdOrder(baseIds, localIds), existingIdOrder(baseIds, latestIds))
  ) {
    addConflict(
      conflicts,
      `${path}.$order`,
      "Items were reordered differently in your draft and GitHub.",
    );
  }

  const orderedIds = [
    ...preferredIds,
    ...localIds.filter((id) => !preferredIds.includes(id)),
    ...latestIds.filter((id) => !preferredIds.includes(id) && !localIds.includes(id)),
  ];
  const merged: Array<Record<string, unknown>> = [];

  for (const id of Array.from(new Set(orderedIds))) {
    const value = mergeValue(
      baseById.get(id) ?? missing,
      localById.get(id) ?? missing,
      latestById.get(id) ?? missing,
      `${path}[id=${id}]`,
      conflicts,
    );

    if (value !== missing && isRecord(value)) merged.push(value);
  }

  return merged;
}

function isStableIdCollection(...collections: unknown[][]) {
  const items = collections.flat();
  return (
    items.length > 0 &&
    collections.every((collection) => {
      const ids = collection.map((item) => (isRecord(item) ? item.id : undefined));
      return ids.every((id) => typeof id === "string" && id.length > 0) && new Set(ids).size === ids.length;
    })
  );
}

function createIdMap(items: Array<Record<string, unknown>>) {
  return new Map(items.map((item) => [getStableId(item), item]));
}

function getStableId(item: Record<string, unknown>) {
  return item.id as string;
}

function hasReorderedExistingItems(baseIds: string[], candidateIds: string[]) {
  const candidateOrder = existingIdOrder(baseIds, candidateIds);
  const baseOrder = baseIds.filter((id) => candidateIds.includes(id));
  return !valuesEqual(candidateOrder, baseOrder);
}

function existingIdOrder(baseIds: string[], candidateIds: string[]) {
  return candidateIds.filter((id) => baseIds.includes(id));
}

function addConflict(
  conflicts: CatalogueMergeConflict[],
  path: string,
  message: string,
) {
  conflicts.push({ path, message });
}

function cloneValue<T extends MergeValue>(value: T): T {
  return value === missing ? value : structuredClone(value);
}

function valuesEqual(left: MergeValue, right: MergeValue) {
  if (left === missing || right === missing) return left === right;
  return JSON.stringify(left) === JSON.stringify(right);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
