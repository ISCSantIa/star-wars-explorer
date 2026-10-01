"use client";

import { Typography, Flex, Button, Result } from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import CharacterFilmList from "./CharacterFilmList";
import type { GetCharacterDetailQuery } from "@/graphql/generated/graphql";

const { Title } = Typography;

type Person = NonNullable<
    NonNullable<GetCharacterDetailQuery["allPeople"]>["people"]
>[number];

type Film = NonNullable<
    NonNullable<GetCharacterDetailQuery["allFilms"]>["films"]
>[number];

interface CharacterDetailProps {
    person: NonNullable<Person>;
    films: NonNullable<Film>[];
}

interface CharacterNotFoundProps {
    notFound: true;
}

type CharacterDetailViewProps = CharacterDetailProps | CharacterNotFoundProps;

function isNotFound(
    props: CharacterDetailViewProps
): props is CharacterNotFoundProps {
    return "notFound" in props;
}

export default function CharacterDetailView(props: CharacterDetailViewProps) {
    if (isNotFound(props)) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Result
                    status="404"
                    title="Personaje no encontrado"
                    subTitle="El personaje que buscas no existe o no está disponible."
                    extra={
                        <Link href="/">
                            <Button type="primary" icon={<ArrowLeftOutlined />}>
                                Volver a personajes
                            </Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    const { person, films } = props;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f5f5",
            }}
        >
            <div
                style={{
                    maxWidth: 800,
                    width: "100%",
                    margin: "0 auto",
                    padding: "32px 24px",
                }}
            >
                <Flex vertical gap={24}>
                    <Flex align="center" gap={12}>
                        <UserOutlined
                            style={{ fontSize: 28, color: "#1677ff" }}
                        />
                        <Title level={2} style={{ margin: 0 }}>
                            {person.name}
                        </Title>
                    </Flex>

                    <CharacterFilmList films={films} />
                </Flex>
            </div>
        </div>
    );
}
