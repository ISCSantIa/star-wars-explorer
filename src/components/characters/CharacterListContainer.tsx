"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import { Typography, Flex, Input } from "antd";
import CharacterGrid from "./CharacterGrid";
import CharacterPagination from "./CharacterPagination";
import CharacterDrawer from "./CharacterDrawer";
import type { GetCharactersQuery, GetCharacterDetailQuery } from "@/graphql/generated/graphql";

const { Title, Text } = Typography;

const PAGE_SIZE = 10;

type Person = NonNullable<
    NonNullable<GetCharacterDetailQuery["allPeople"]>["people"]
>[number];

type Film = NonNullable<
    NonNullable<GetCharacterDetailQuery["allFilms"]>["films"]
>[number];

interface CharacterListContainerProps {
    initialData: GetCharactersQuery;
    fetchCharacters: (
        variables: { first?: number; after?: string; last?: number; before?: string }
    ) => Promise<GetCharactersQuery>;
    activePerson?: NonNullable<Person> | null;
    activeFilms?: NonNullable<Film>[];
    activeNotFound?: boolean;
    allCharacters?: Person[];
}

export default function CharacterListContainer({
    initialData,
    fetchCharacters,
    activePerson = null,
    activeFilms = [],
    activeNotFound = false,
    allCharacters = [],
}: CharacterListContainerProps) {
    const [data, setData] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const [cursorStack, setCursorStack] = useState<string[]>([]);
    const [forwardCursors, setForwardCursors] = useState<Record<number, string>>(() => {
        return initialData.allPeople?.pageInfo.endCursor 
            ? { 1: initialData.allPeople.pageInfo.endCursor } 
            : ({} as Record<number, string>);
    });
    const [error, setError] = useState<string>();
    const [retryAction, setRetryAction] = useState<{ run: () => void } | null>(null);
    const [isPending, startTransition] = useTransition();

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const allPeople = data.allPeople;
    const paginatedCharacters = allPeople?.people ?? [];
    const totalCount = allPeople?.totalCount ?? 0;
    const pageInfo = allPeople?.pageInfo;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const isSearching = debouncedSearch.trim().length > 0;
    
    let displayCharacters = paginatedCharacters;
    if (isSearching) {
        displayCharacters = allCharacters.filter((c) =>
            c?.name?.toLowerCase().includes(debouncedSearch.toLowerCase().trim())
        );
    }

    const handleNextPage = useCallback(() => {
        const cursorToUse = forwardCursors[currentPage] || pageInfo?.endCursor;
        if (!cursorToUse) return;

        const execute = () => {
            startTransition(async () => {
                try {
                    setError(undefined);
                    const result = await fetchCharacters({
                        first: PAGE_SIZE,
                        after: cursorToUse,
                    });
                    const newStartCursor = result.allPeople?.pageInfo.startCursor;
                    if (newStartCursor) {
                        setCursorStack((prev) => [...prev, newStartCursor]);
                    }
                    
                    const newEndCursor = result.allPeople?.pageInfo.endCursor;
                    if (newEndCursor) {
                        setForwardCursors((prev) => ({ ...prev, [currentPage + 1]: newEndCursor }));
                    }

                    setData(result);
                    setCurrentPage((prev) => prev + 1);
                    setRetryAction(null);
                } catch (err) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Error al cargar la siguiente página"
                    );
                    setRetryAction({ run: execute });
                }
            });
        };

        execute();
    }, [currentPage, forwardCursors, pageInfo?.endCursor, fetchCharacters]);

    const handlePreviousPage = useCallback(() => {
        if (cursorStack.length === 0) return;

        const stack = [...cursorStack];
        const cursorToUse = stack.pop()!;

        const execute = () => {
            startTransition(async () => {
                try {
                    setError(undefined);
                    const result = await fetchCharacters({
                        last: PAGE_SIZE,
                        before: cursorToUse,
                    });

                    const newEndCursor = result.allPeople?.pageInfo.endCursor;
                    if (newEndCursor) {
                        setForwardCursors((prev) => ({ 
                            ...prev, 
                            [currentPage - 1]: prev[currentPage - 1] || newEndCursor 
                        }));
                    }

                    setCursorStack(stack);
                    setData(result);
                    setCurrentPage((prev) => prev - 1);
                    setRetryAction(null);
                } catch (err) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Error al cargar la página anterior"
                    );
                    setRetryAction({ run: execute });
                }
            });
        };

        execute();
    }, [cursorStack, currentPage, fetchCharacters]);

    return (
        <Flex vertical gap={24} style={{ width: "100%" }}>
            <Flex justify="space-between" align="baseline" wrap="wrap" gap={16}>
                <Flex align="baseline" gap={8} wrap="wrap">
                    <Title level={2} style={{ margin: 0 }}>
                        Personajes
                    </Title>
                    {totalCount > 0 && !isSearching && (
                        <Text type="secondary">
                            {totalCount} personajes en total
                        </Text>
                    )}
                </Flex>

                <Input
                    placeholder="Buscar personaje..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                    aria-label="Buscar personaje por nombre"
                    style={{ width: "100%", maxWidth: 300 }}
                />
            </Flex>

            <CharacterGrid
                characters={displayCharacters}
                loading={isPending}
                error={error}
                pageSize={PAGE_SIZE}
                onRetry={retryAction?.run}
            />

            {!isSearching && (
                <CharacterPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    hasNextPage={currentPage < totalPages}
                    hasPreviousPage={currentPage > 1}
                    loading={isPending}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                />
            )}

            <CharacterDrawer
                person={activePerson}
                films={activeFilms}
                notFound={activeNotFound}
            />
        </Flex>
    );
}
