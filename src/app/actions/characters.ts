"use server";

import { query } from "@/lib/apollo/client";
import { GetCharactersDocument } from "@/graphql/generated/graphql";
import type { GetCharactersQuery } from "@/graphql/generated/graphql";

interface FetchCharactersVariables {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
}

export async function fetchCharacters(
    variables: FetchCharactersVariables
): Promise<GetCharactersQuery> {
    const { data } = await query({
        query: GetCharactersDocument,
        variables,
    });

    if (!data) {
        throw new Error("No se recibieron datos de la API");
    }

    return data;
}
