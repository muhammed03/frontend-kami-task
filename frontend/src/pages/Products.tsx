import React from "react";
import ProductsList from "../components/ProductsList";
import { Box, NavLink, Title, Flex, Input, Container } from "@mantine/core";

const Products = () => {
    return (
        <Container>
            <Title order={1} my={20}>
                Products
            </Title>
            <Input w={300} placeholder="Search..." my={20} />
            <ProductsList />
            <Flex justify="end">
                <Box w={200} mt={20}>
                    <NavLink
                        ta="center"
                        variant="filled"
                        href="/products/create"
                        label="Add"
                        active
                    />
                </Box>
            </Flex>
        </Container>
    )
}

export default Products;