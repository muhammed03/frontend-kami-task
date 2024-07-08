import React from "react";
import { Button, Table } from '@mantine/core';

const elements = [
    { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
    { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
  ];

const ProductsList = () => {
    const rows = elements.map((element) => (
        <Table.Tr key={element.name}>
          <Table.Td>{element.position}</Table.Td>
          <Table.Td>{element.name}</Table.Td>
          <Table.Td>{element.symbol}</Table.Td>
          <Table.Td>{element.mass}</Table.Td>
          <Table.Td>image</Table.Td>
          <Table.Td>
            <Button>
                Edit
            </Button>
            <Button ml={20} color="red">
                Delete
            </Button>
          </Table.Td>
        </Table.Tr>
      ));

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
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      );
}

export default ProductsList;