"use client";

import Link from "next/link";
import { Card, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { GetCharactersQuery } from "@/graphql/generated/graphql";

const { Text } = Typography;

type Person = NonNullable<
    NonNullable<GetCharactersQuery["allPeople"]>["people"]
>[number];

interface CharacterCardProps {
    character: Person;
}

export default function CharacterCard({ character }: CharacterCardProps) {
    if (!character) return null;

    return (
        <Link
            href={`/?character=${character.id}`}
            scroll={false}
            style={{ display: "block", textDecoration: "none" }}
        >
            <Card
                hoverable
                styles={{
                    body: {
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "16px 20px",
                    },
                }}
            >
                <UserOutlined
                    style={{
                        fontSize: 24,
                        color: "#1677ff",
                        flexShrink: 0,
                    }}
                />
                <Text
                    strong
                    ellipsis={{ tooltip: character.name ?? undefined }}
                    style={{ fontSize: 15 }}
                >
                    {character.name}
                </Text>
            </Card>
        </Link>
    );
}

