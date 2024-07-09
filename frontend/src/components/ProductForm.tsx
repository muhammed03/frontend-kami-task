import React, { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { TextInput, Textarea, Select, Button, Container, FileInput } from "@mantine/core";
import { createProduct, updateProduct } from '../redux/productsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';  

interface IProductForm {
    isEdit: boolean
}

interface FormValues {
    id?: string;
    name: string;
    description: string;
    image: string;
    price: number;
    status: 'active' | 'archived';
}

const ProductForm = (props: IProductForm) => {
    const { id } = useParams<{ id: string }>();
    const { isEdit } = props;

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const product = useSelector((state: RootState) => state.products.items.find((p) => p.id === id));

    const { register, handleSubmit, setValue } = useForm<FormValues>({
        defaultValues: product || {
          name: '',
          description: '',
          image: '',
          price: 0,
          status: 'active',
        },
      });

    useEffect(() => {
        if (isEdit && product) {
          setValue('name', product.name);
          setValue('description', product.description);
          setValue('image', product.image);
          setValue('price', product.price);
          setValue('status', product.status);
        }
    }, [isEdit, product, setValue]);
    
      const onSubmit = (data: FormValues) => {
        if (isEdit) {
          dispatch(updateProduct({ ...data, id: id! })).then(() => navigate('/products'));
        } else {
          dispatch(createProduct(data)).then(() => navigate('/products'));
        }
      };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
                label="Name"
                {...register('name', { required: true })}
            />
            <Textarea
                label="Description"
                {...register('description')}
            />
            {/* <FileInput
                label="Image URL"
            /> */}
            <TextInput
                label="Price"
                {...register('price', { required: true })}
            />
            <Button mt={30} type="submit">{isEdit ? 'Edit' : 'Create'} product</Button>
        </form>
    );
}

export default ProductForm;