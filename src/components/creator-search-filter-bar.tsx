"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PLATFORM_LABELS } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const DEBOUNCE_MS = 300;

export function CreatorSearchFilterBar({ availableNiches }: { availableNiches: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchDraft, setSearchDraft] = useState(searchParams.get("search") ?? "");
  const platform = searchParams.get("platform") ?? "";
  const niche = searchParams.get("niche") ?? "";

  const hasActiveFilters = Boolean(searchParams.get("search") || platform || niche);

  // Debounce search input -> URL query param.
  useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchDraft) {
        params.set("search", searchDraft);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, DEBOUNCE_MS);

    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    setSearchDraft("");
    router.replace(pathname);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="sm:w-64">
        <Input
          aria-label="Search creators by name or handle"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Search name or handle…"
        />
      </div>

      <Select
        aria-label="Filter by platform"
        value={platform}
        onChange={(e) => updateParam("platform", e.target.value)}
        className="sm:w-44"
      >
        <option value="">All platforms</option>
        {Object.entries(PLATFORM_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>

      <Select
        aria-label="Filter by niche"
        value={niche}
        onChange={(e) => updateParam("niche", e.target.value)}
        className="sm:w-44"
        disabled={availableNiches.length === 0}
      >
        <option value="">All niches</option>
        {availableNiches.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </Select>

      {hasActiveFilters && (
        <Button type="button" variant="ghost" onClick={clearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}