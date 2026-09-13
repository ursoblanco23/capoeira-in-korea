import {queryOptions, useQuery} from "@tanstack/react-query";
import dojangService from "@/services/api/services/dojangService.ts";
import type {DojangSearchParams} from "@/types/dojang.ts";

const DOJANG_STALE_TIME = 5 * 60 * 1000;

export const dojangQueryKeys = {
    all: ["dojangs"] as const,
    lists: () => [...dojangQueryKeys.all, "list"] as const,
    list: (searchParams?: DojangSearchParams) =>
        [...dojangQueryKeys.lists(), searchParams ?? {}] as const,
    details: () => [...dojangQueryKeys.all, "detail"] as const,
    detail: (dojangId: number | undefined) =>
        [...dojangQueryKeys.details(), dojangId] as const,
};

export const dojangListQueryOptions = (
    searchParams?: DojangSearchParams,
) => {
    return queryOptions({
        queryKey: dojangQueryKeys.list(searchParams),
        queryFn: () => dojangService.getDojangs(searchParams),
        staleTime: DOJANG_STALE_TIME,
    });
};

export const useDojangsQuery = (
    searchParams?: DojangSearchParams,
) => {
    return useQuery(dojangListQueryOptions(searchParams));
};

export const dojangDetailQueryOptions = (
    dojangId: number | undefined,
) => {
    const isValidDojangId =
        dojangId !== undefined &&
        Number.isSafeInteger(dojangId) &&
        dojangId > 0;

    return queryOptions({
        queryKey: dojangQueryKeys.detail(dojangId),
        queryFn: () => {
            if (!isValidDojangId) {
                throw new Error("유효한 도장 ID가 필요합니다.");
            }

            return dojangService.getDojangById(dojangId);
        },
        enabled: isValidDojangId,
        staleTime: DOJANG_STALE_TIME,
    });
};

export const useDojangQuery = (
    dojangId: number | undefined,
) => {
    return useQuery(dojangDetailQueryOptions(dojangId));
};
