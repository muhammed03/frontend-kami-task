import React from 'react';
import ProductForm from '../components/ProductForm';
import { Container, Title } from '@mantine/core';

const EditProduct: React.FC = () => {
  return (
    <Container>
      <Title order={1} my={20}>Edit Product</Title>
      <ProductForm isEdit/>
    </Container>
  );
};

export default EditProduct;