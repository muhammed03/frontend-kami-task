import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { TextInput, Textarea, Button, FileInput } from "@mantine/core";
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
    file: File | null;
    price: number;
    status: 'active' | 'archived';
}

const ProductForm = (props: IProductForm) => {
    const [currentImage, setCurrentImage] = useState<string | null>(null);

    const { id } = useParams<{ id: string }>();
    const { isEdit } = props;

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const product = useSelector((state: RootState) => state.products.items.find((p) => p.id == id));

    const { register, handleSubmit, setValue } = useForm<FormValues>({
        defaultValues: {
          name: '',
          description: '',
          file: null,
          price: 0,
          status: 'active',
        },
    });

    useEffect(() => {
        if (isEdit && product) {
          setValue('name', product.name);
          setValue('description', product.description);
          setValue('price', product.price);
          setValue('status', product.status);
          setCurrentImage(product.imageUrl || null)
        }
    }, [isEdit, product, setValue]);
    
      const onSubmit = (data: FormValues) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('status', data.status);

        if (data.file) {
            formData.append('file', data.file);
        }

        if (isEdit) {
            dispatch(updateProduct({ formData, id: id! })).then(() => navigate('/products'));
        } else {
            dispatch(createProduct(formData)).then(() => navigate('/products'));
        }
      };
    
    const handleFileChange = (file: File | null) => {
        setValue('file', file);
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
            <FileInput
                label="Image"
                placeholder={currentImage ?? 'Select image'}
                onChange={handleFileChange}
            />
            <TextInput
                label="Price"
                {...register('price', { required: true })}
            />
            <Button mt={30} type="submit">{isEdit ? 'Edit' : 'Create'} product</Button>
        </form>
    );
}

export default ProductForm;