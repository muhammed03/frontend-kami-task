import React from "react";
import { Link } from 'react-router-dom';
import { Button, Table, Image } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Product } from '../redux/productsSlice';

interface Props {
    products: Product[];
    deleteProduct: (id: string) => void;
}

const ProductsList : React.FC<Props> = ({ products, deleteProduct }) => {
    const navigate = useNavigate();

      return (
        <Table>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Description</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Image</Table.Th>
                    <Table.Th>Actions</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {products.map((product) => (
                    <Table.Tr key={product.id}>
                        <Table.Td>{product.id}</Table.Td>
                        <Table.Td>{product.name}</Table.Td>
                        <Table.Td>{product.description}</Table.Td>
                        <Table.Td>{product.price}</Table.Td>
                        <Table.Td>
                            <Image 
                                w={200}
                                src={product.imageUrl}
                            />
                        </Table.Td>
                        <Table.Td>
                            <Button
                                onClick={() => navigate(`/products/edit/${product?.id}`)}
                            >
                                Edit
                            </Button>
                            <Button ml={20} color="red" onClick={() => {
                                if(product.id) {
                                    deleteProduct(product.id)
                                }
                            }}>
                                Delete
                            </Button>
                        </Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
            </Table>
      );
}

export default ProductsList;