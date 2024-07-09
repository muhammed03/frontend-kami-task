import React, { useEffect, useState } from "react";
import { useSearchParams  } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchProducts, deleteProduct, setCurrentPage  } from '../redux/productsSlice';
import { Box, NavLink, Title, Flex, Input, Container, Pagination, Button } from "@mantine/core";
import ProductsList from "../components/ProductsList";

const Products = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, setSearchParams] = useSearchParams();
    const products = useSelector((state: RootState) => state.products.items);
    const pageParam = searchParams.get('page');
    const searchParam = searchParams.get('search');
    const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
    const totalPages = useSelector((state: RootState) => state.products.totalPages);
    const status = useSelector((state: RootState) => state.products.status);
    const error = useSelector((state: RootState) => state.products.error);

    const [search, setSearch] = useState(searchParam || '');

    useEffect(() => {
        dispatch(setCurrentPage(currentPage)); 
        dispatch(fetchProducts({page: currentPage, search}));
    }, [dispatch, searchParams]);

    const handleDelete = (id: string) => {
        dispatch(deleteProduct(id));
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: newPage.toString() });
        dispatch(setCurrentPage(newPage));
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearch = event.target.value;
        setSearch(newSearch);
    };

    const handleSearch = () => {
        setSearchParams({ search: search });
    }

    const clearSearch = () => {
        setSearchParams({});
        setSearch('');
    }

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
            <Flex align="center" gap={20}>
                <Input 
                    value={search}
                    onChange={handleSearchChange}
                    w={300} 
                    placeholder="Search..." 
                    my={20}
                />
                <Button onClick={handleSearch}>
                    Search
                </Button>
                <Button onClick={clearSearch} color="red">
                    Clear
                </Button>
            </Flex>
            <ProductsList products={products} deleteProduct={handleDelete} />
            <Pagination total={totalPages} value={currentPage} onChange={handlePageChange} mt="sm" />
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