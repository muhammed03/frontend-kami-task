import React from 'react';
import ProductForm from '../components/ProductForm';
import { Container, Title } from '@mantine/core';

const CreateProduct: React.FC = () => {
  return (
    <Container>
      <Title order={1} my={20}>Create Product</Title>
      <ProductForm isEdit={false} />
    </Container>
  );
};

export default CreateProduct;