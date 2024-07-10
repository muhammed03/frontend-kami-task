import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { TextInput, Textarea, Button, FileInput, Flex } from "@mantine/core";
import { createProduct, fetchProducts, updateProduct } from '../redux/productsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';  
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';

interface IProductForm {
    isEdit: boolean
}

interface FormValues {
    id?: string;
    name: string;
    description: string;
    file: File | null;
    price: number | '';
    status: 'active' | 'archived';
}

const ProductForm = (props: IProductForm) => {
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
      );
      
    const handleEditorChange = (state: EditorState) => {
        setEditorState(state);
    };
    const products = useSelector((state: RootState) => state.products.items);

    const { id } = useParams<{ id: string }>();
    const { isEdit } = props;

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const product = useSelector((state: RootState) => state.products.items.find((p) => p.id == id));

    const { register, handleSubmit, setValue, setError } = useForm<FormValues>({
        defaultValues: {
          name: '',
          description: '',
          file: null,
          price: '',
          status: 'active',
        },
    });

    useEffect(() => {
        dispatch(fetchProducts({}))
    }, [dispatch])

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
        formData.append('description', JSON.stringify(convertToRaw(editorState.getCurrentContent())));
        formData.append('price', data.price.toString());
        formData.append('status', data.status);

        if (data.file) {
            formData.append('file', data.file);
        } else {
            setError('file', { type: 'custom', message: 'custom message' });
            return;
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

    const handleCancel = () => {
        navigate('/products')
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
                label="Name"
                {...register('name', { required: true })}
                required
            />
            {/* <Textarea
                label="Description"
                {...register('description')}
                required
            /> */}
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
            />
            <FileInput
                label="Image"
                placeholder={currentImage ?? ''}
                {...register('file', { required: true })}
                onChange={handleFileChange}
                required
            />
            <TextInput
                type="number"
                label="Price"
                {...register('price', { required: true })}
                required
            />
            <Flex mt={30} gap={20} align="center">
                <Button color="green.6" type="submit">{isEdit ? 'Edit' : 'Create'} product</Button>
                <Button color="red.8" onClick={handleCancel}> Cancel</Button>
            </Flex>
        </form>
    );
}

export default ProductForm;