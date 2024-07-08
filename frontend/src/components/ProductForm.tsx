import React from "react";
import { TextInput, Textarea, Select, Button, Container, FileInput } from "@mantine/core";

interface IProductForm {
    isEdit: boolean
}

const ProductForm = (props: IProductForm) => {
    const { isEdit } = props
    return (
    <form>
        <TextInput
            label="Name"
        />
        <Textarea
            label="Description"
        />
        <FileInput
            label="Image URL"
        />
        <TextInput
            label="Price"
        />
        <Select
            label="Status"
            data={['active', 'archived']}
        />
        <Button mt={30} type="submit">{isEdit ? 'Edit' : 'Create'} product</Button>
    </form>
    );
}

export default ProductForm;