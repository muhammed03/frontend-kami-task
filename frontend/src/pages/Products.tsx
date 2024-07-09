import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchProducts, deleteProduct } from '../redux/productsSlice';
import { Box, NavLink, Title, Flex, Input, Container } from "@mantine/core";
import ProductsList from "../components/ProductsList";

const Products = () => {
    const dispatch = useDispatch<AppDispatch>();
    const products = useSelector((state: RootState) => state.products.items);
    const status = useSelector((state: RootState) => state.products.status);
    const error = useSelector((state: RootState) => state.products.error);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleDelete = (id: string) => {
        dispatch(deleteProduct(id));
    };

    if (status === 'loading') {
        return <p>Loading...</p>;
    }
    
    if (status === 'failed') {
    return <p>Error: {error}</p>;
    }

    return (
        <Container>
            <Title order={1} my={20}>
                Products
            </Title>
            <Input w={300} placeholder="Search..." my={20} />
            <ProductsList products={products} deleteProduct={handleDelete} />
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