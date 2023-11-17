import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { server } from '..';
import ErrorComponent from './ErrorComponent';
import Loader from './Loader';
import {
  Container,
  HStack,
  Text,
  Grid,
  VStack,
  Heading,
  Button,
} from '@chakra-ui/react';
import MiningHardwareEditForm from './MiningHardwareEditForm';
import MiningHardwareCreateForm from './MiningHardwareCreateForm';

const HardWares = () => {

  const [fetchedData, setFetchedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingHardware, setEditingHardware] = useState(null);

  useEffect(() => {
    fetchHardwares();
  }, []);

  const fetchHardwares = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${server}/mininghardware`);
      setFetchedData(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
      setLoading(false);
    }
  };

  const handleCreate = async (hardwareData) => {
    setIsCreateFormOpen(false);
    try {
      await axios.post('/miningHardware', hardwareData);
      fetchHardwares();
    } catch (error) {
      console.error('Error creating hardware:', error);
    }
  };

  const handleEdit = async (hardware) => {
    setEditingHardware(hardware);
    setIsEditFormOpen(true);
    try {
      await axios.put(`/miningHardware/${hardware.id}`, hardware);
      fetchHardwares();
    } catch (error) {
      console.error('Error updating hardware:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/miningHardware/${id}`);
      fetchHardwares();
    } catch (error) {
      console.error('Error deleting hardware:', error);
    }
  };


  if (error) {
    return < ErrorComponent message={
      "you got an error in Hardware component"
    } />
  }


  return (

    <Container maxW={'container.xl'} >

      {loading ? <Loader /> : <>
        <HStack textTransform={'capitalize'}
          w={'full'}
          p={'4'}
          fontSize={'2xl'}
          borderBottom={'8px'}
        >
          <Text textAlign={'center'}
            w={'full'}
          >
            You can add, edit and delete mining hardwares
          </Text>
          <Button onClick={() => setIsCreateFormOpen(true)} colorScheme="orange" size="lg">
        Add New Hardware
      </Button>


        </HStack>


      {isCreateFormOpen && (
        <MiningHardwareCreateForm
          isOpen={isCreateFormOpen}
          onCreate={handleCreate}
          onClose={() => setIsCreateFormOpen(false)}
        />
      )}

      {isEditFormOpen && (
        <MiningHardwareEditForm
          isOpen={isEditFormOpen}
          hardware={editingHardware}
          onEdit={handleEdit}
          onClose={() => setIsEditFormOpen(false)}
        />
      )}


        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {fetchedData.map((hardware) => (
          <HardwareCart
            key={hardware.id}
            id={hardware.id}
            name={hardware.name}
            location={hardware.location}
            hashRate={hardware.hashRate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </Grid>
      </>
      }

    </Container>


  )
}


function formatHashRate(hashRateStr) {
  const [numberPart] = hashRateStr.split(' ');

  const numericPart = parseFloat(numberPart);
  if (isNaN(numericPart)) {
    return 'Invalid hash rate';
  }

  const formattedNumericPart = numericPart.toFixed(3);

  return `${formattedNumericPart} TH/S`;
}


const HardwareCart = ({ name, id, location, hashRate, onEdit, onDelete }) => {
  return (
    <a>
      <VStack w={'100'} bg={'rgb(252,211,76)'} shadow={'2xl'} p={'10'} borderRadius={'lg'} transition={"all 0.3s"} m={'4'}
        css={{
          "&:hover": {
            transform: "scale(1.1)",
          }
        }}
      >
        <Heading size={'md'} noOfLines={'1'} >Name: {name}</Heading>
        <Text noOfLines={'2'} > Location:{location}</Text>
        <Text noOfLines={'2'} > HashRate: {formatHashRate(hashRate)} </Text>

        <Button width="100px" onClick={() => onEdit({ id, name, location, hashRate })}>Edit</Button>
        <Button width="100px" onClick={() => onDelete(id)}>Delete</Button>

      </VStack>
    </a>
  )
}


export default HardWares;
