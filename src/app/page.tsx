import { query } from "@/lib/apollo/client";
import {
    GetCharactersDocument,
    GetCharacterDetailDocument,
    type GetCharacterDetailQuery,
} from "@/graphql/generated/graphql";
import { fetchCharacters } from "./actions/characters";
import CharacterListContainer from "@/components/characters/CharacterListContainer";

type Film = NonNullable<
    NonNullable<GetCharacterDetailQuery["allFilms"]>["films"]
>[number];

function getFilmsForCharacter(
    data: GetCharacterDetailQuery,
    characterId: string
): NonNullable<Film>[] {
    const allFilms = data.allFilms?.films;
    if (!allFilms) return [];

    return allFilms.filter((film): film is NonNullable<Film> => {
        if (!film) return false;
        const characters = film.characterConnection?.characters;
        if (!characters) return false;
        return characters.some((c) => c?.id === characterId);
    });
}

interface SearchParams {
    [key: string]: string | string[] | undefined;
}

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const sp = await searchParams;
    const characterParam = typeof sp.character === "string" ? sp.character : undefined;
    const decodedCharacterId = characterParam ? decodeURIComponent(characterParam) : undefined;

    // Fetch list and detail in parallel if character param exists
    const [charactersResult, detailResult] = await Promise.all([
        query({
            query: GetCharactersDocument,
            variables: { first: 10 },
        }),
        decodedCharacterId
            ? query({ query: GetCharacterDetailDocument })
            : Promise.resolve(null),
    ]);

    const charactersData = charactersResult.data;

    if (!charactersData) {
        throw new Error("No se pudieron cargar los personajes");
    }

    let activePerson = null;
    let activeFilms: NonNullable<Film>[] = [];
    let notFound = false;

    if (decodedCharacterId && detailResult?.data) {
        activePerson =
            detailResult.data.allPeople?.people?.find(
                (p) => p?.id === decodedCharacterId
            ) ?? null;

        if (activePerson) {
            activeFilms = getFilmsForCharacter(detailResult.data, decodedCharacterId);
        } else {
            notFound = true;
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f5f5",
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    width: "100%",
                    margin: "0 auto",
                    padding: "32px 24px",
                }}
            >
                <CharacterListContainer
                    initialData={charactersData}
                    fetchCharacters={fetchCharacters}
                    activePerson={activePerson}
                    activeFilms={activeFilms}
                    activeNotFound={notFound}
                />
            </div>
        </div>
    );
}
