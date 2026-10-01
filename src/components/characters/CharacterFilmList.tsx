"use client";

import { Card, Tag, Typography, Empty, Flex } from "antd";
import { VideoCameraOutlined, GlobalOutlined } from "@ant-design/icons";
import type { GetCharacterDetailQuery } from "@/graphql/generated/graphql";

const { Text, Title } = Typography;

type Film = NonNullable<
    NonNullable<GetCharacterDetailQuery["allFilms"]>["films"]
>[number];

interface CharacterFilmListProps {
    films: NonNullable<Film>[];
}

export default function CharacterFilmList({ films }: CharacterFilmListProps) {
    if (films.length === 0) {
        return (
            <Empty
                description="No se encontraron películas para este personaje"
                style={{ padding: "24px 0" }}
            />
        );
    }

    return (
        <Flex vertical gap={16}>
            <Title level={4} style={{ margin: 0 }}>
                Películas ({films.length})
            </Title>
            {films.map((film) => {
                const planets =
                    film.planetConnection?.planets?.filter(
                        (p): p is NonNullable<typeof p> => p !== null
                    ) ?? [];

                return (
                    <Card key={film.id} size="small">
                        <Flex vertical gap={8}>
                            <Flex align="center" gap={8}>
                                <VideoCameraOutlined
                                    style={{ color: "#1677ff" }}
                                />
                                <Text strong>{film.title}</Text>
                            </Flex>

                            <Text type="secondary">
                                Dirigida por {film.director}
                            </Text>

                            {planets.length > 0 && (
                                <Flex wrap gap={8} align="center">
                                    <GlobalOutlined
                                        style={{
                                            color: "#8c8c8c",
                                            fontSize: 12,
                                        }}
                                    />
                                    {planets.map((planet) => (
                                        <Tag key={planet.id} color="blue" style={{ margin: 0 }}>
                                            {planet.name}
                                        </Tag>
                                    ))}
                                </Flex>
                            )}
                        </Flex>
                    </Card>
                );
            })}
        </Flex>
    );
}
