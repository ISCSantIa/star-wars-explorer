"use client";

import { Row, Col, Skeleton, Alert, Empty, Button } from "antd";
import CharacterCard from "./CharacterCard";
import type { GetCharactersQuery } from "@/graphql/generated/graphql";

type Person = NonNullable<
    NonNullable<GetCharactersQuery["allPeople"]>["people"]
>[number];

interface CharacterGridProps {
    characters: Person[] | null | undefined;
    loading: boolean;
    error?: string;
    pageSize: number;
    onRetry?: () => void;
}

export default function CharacterGrid({
    characters,
    loading,
    error,
    pageSize,
    onRetry,
}: CharacterGridProps) {
    if (error) {
        return (
            <Alert
                message="Error al cargar personajes"
                description={error}
                type="error"
                showIcon
                style={{ marginBottom: 24 }}
                action={
                    onRetry && (
                        <Button size="small" type="primary" onClick={onRetry}>
                            Reintentar
                        </Button>
                    )
                }
            />
        );
    }

    if (loading) {
        return (
            <Row gutter={[16, 16]}>
                {Array.from({ length: pageSize }).map((_, index) => (
                    <Col key={index} xs={24} sm={12} md={8} lg={6}>
                        <Skeleton.Node
                            active
                            style={{ width: "100%", height: 66 }}
                        >
                            <span />
                        </Skeleton.Node>
                    </Col>
                ))}
            </Row>
        );
    }

    if (!characters || characters.length === 0) {
        return (
            <Empty
                description="No se encontraron personajes"
                style={{ padding: "48px 0" }}
            />
        );
    }

    return (
        <Row gutter={[16, 16]}>
            {characters.map((person) => (
                <Col key={person?.id} xs={24} sm={12} md={8} lg={6}>
                    <CharacterCard character={person} />
                </Col>
            ))}
        </Row>
    );
}
