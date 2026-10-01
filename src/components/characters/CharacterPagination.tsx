"use client";

import { Button, Flex, Typography } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface CharacterPaginationProps {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    loading: boolean;
    onNextPage: () => void;
    onPreviousPage: () => void;
}

export default function CharacterPagination({
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    loading,
    onNextPage,
    onPreviousPage,
}: CharacterPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Flex
            justify="center"
            align="center"
            gap={16}
            style={{ marginTop: 32 }}
        >
            <Button
                icon={<LeftOutlined />}
                disabled={!hasPreviousPage || loading}
                onClick={onPreviousPage}
                loading={loading}
            >
                Anterior
            </Button>
            <Text type="secondary">
                Página {currentPage} de {totalPages}
            </Text>
            <Button
                icon={<RightOutlined />}
                iconPlacement="end"
                disabled={!hasNextPage || loading}
                onClick={onNextPage}
                loading={loading}
            >
                Siguiente
            </Button>
        </Flex>
    );
}
