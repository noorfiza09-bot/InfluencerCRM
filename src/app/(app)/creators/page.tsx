import { listCreators, listNiches, countAllCreators } from "@/server/creators";
import { creatorSearchParamsSchema, type PlatformValue } from "@/lib/validators";
import { CreatorList } from "@/components/creator-list";
import { CreatorSearchFilterBar } from "@/components/creator-search-filter-bar";
import { CreatorEmptyState } from "@/components/creator-empty-state";
import { AddCreatorButton } from "@/components/add-creator-button";

export default async function CreatorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  const parsed = creatorSearchParamsSchema.safeParse({
    search: typeof rawParams.search === "string" ? rawParams.search : undefined,
    platform: typeof rawParams.platform === "string" ? rawParams.platform : undefined,
    niche: typeof rawParams.niche === "string" ? rawParams.niche : undefined,
  });

  const filters = parsed.success ? parsed.data : {};
  const hasFilters = Boolean(filters.search || filters.platform || filters.niche);

  const [creators, availableNiches, totalCount] = await Promise.all([
    listCreators({
      search: filters.search,
      platform: filters.platform as PlatformValue | undefined,
      niche: filters.niche,
    }),
    listNiches(),
    countAllCreators(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Creators</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {totalCount} creator{totalCount === 1 ? "" : "s"} in your directory
          </p>
        </div>
        {totalCount > 0 && <AddCreatorButton />}
      </div>

      <div className="mt-6">
        <CreatorSearchFilterBar availableNiches={availableNiches} />
      </div>

      <div className="mt-4">
        {creators.length === 0 ? (
          <CreatorEmptyState hasFilters={hasFilters} />
        ) : (
          <CreatorList creators={creators} />
        )}
      </div>
    </div>
  );
}
