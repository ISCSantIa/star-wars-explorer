"use client";

import { useState, useCallback, useTransition } from "react";
import { Typography, Flex } from "antd";
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
}

export default function CharacterListContainer({
    initialData,
    fetchCharacters,
    activePerson = null,
    activeFilms = [],
    activeNotFound = false,
}: CharacterListContainerProps) {
    const [data, setData] = useState(initialData);
    const [currentPage, setCurrentPage] = useState(1);
    const [cursorStack, setCursorStack] = useState<string[]>([]);
    const [error, setError] = useState<string>();
    const [retryAction, setRetryAction] = useState<{ run: () => void } | null>(null);
    const [isPending, startTransition] = useTransition();

    const allPeople = data.allPeople;
    const characters = allPeople?.people ?? [];
    const totalCount = allPeople?.totalCount ?? 0;
    const pageInfo = allPeople?.pageInfo;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const handleNextPage = useCallback(() => {
        if (!pageInfo?.endCursor) return;

        const cursorToUse = pageInfo.endCursor;

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
    }, [pageInfo?.endCursor, fetchCharacters]);

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
    }, [cursorStack, fetchCharacters]);

    return (
        <Flex vertical gap={24} style={{ width: "100%" }}>
            <Flex justify="space-between" align="baseline" wrap="wrap" gap={8}>
                <Title level={2} style={{ margin: 0 }}>
                    Personajes
                </Title>
                {totalCount > 0 && (
                    <Text type="secondary">
                        {totalCount} personajes en total
                    </Text>
                )}
            </Flex>

            <CharacterGrid
                characters={characters}
                loading={isPending}
                error={error}
                pageSize={PAGE_SIZE}
                onRetry={retryAction?.run}
            />

            <CharacterPagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNextPage={pageInfo?.hasNextPage ?? false}
                hasPreviousPage={currentPage > 1}
                loading={isPending}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
            />

            <CharacterDrawer
                person={activePerson}
                films={activeFilms}
                notFound={activeNotFound}
            />
        </Flex>
    );
}
