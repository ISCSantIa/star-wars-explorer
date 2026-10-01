"use client";

import { Drawer } from "antd";
import { useRouter } from "next/navigation";
import CharacterDetailView from "./CharacterDetailView";
import type { GetCharacterDetailQuery } from "@/graphql/generated/graphql";

type Person = NonNullable<
    NonNullable<GetCharacterDetailQuery["allPeople"]>["people"]
>[number];

type Film = NonNullable<
    NonNullable<GetCharacterDetailQuery["allFilms"]>["films"]
>[number];

interface CharacterDrawerProps {
    person: NonNullable<Person> | null;
    films: NonNullable<Film>[];
    notFound?: boolean;
}

export default function CharacterDrawer({ person, films, notFound }: CharacterDrawerProps) {
    const router = useRouter();
    const isOpen = !!person || !!notFound;

    const onClose = () => {
        router.push("/", { scroll: false });
    };

    return (
        <Drawer
            title={person ? "Detalle del personaje" : ""}
            size={800}
            onClose={onClose}
            open={isOpen}
            styles={{ body: { padding: 0 } }}
        >
            {notFound ? (
                <CharacterDetailView notFound />
            ) : person ? (
                <CharacterDetailView person={person} films={films} />
            ) : null}
        </Drawer>
    );
}
