// MiningHardwareCreateForm.jsx
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react';

const MiningHardwareCreateForm = ({ isOpen, onCreate, onClose }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [hashRate, setHashRate] = useState('');

  const handleCreate = () => {
    // Validate input fields
    if (!name || !location || !hashRate) {
      alert('Please fill in all fields.'); // Replace with a better error handling
      return;
    }

    // Call the onCreate function passed from the parent component,
    // which will handle the creation of the new hardware
    onCreate({
      name,
      location,
      hashRate,
    });

    // Clear the form fields
    setName('');
    setLocation('');
    setHashRate('');
    onClose(); // Close the modal after creation
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Hardware</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter hardware name"
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Location</FormLabel>
            <Input 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter hardware location"
            />
          </FormControl>
          <FormControl mt={4} isRequired>
            <FormLabel>Hash Rate</FormLabel>
            <Input 
              value={hashRate}
              onChange={(e) => setHashRate(e.target.value)}
              placeholder="Enter hardware hash rate"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCreate}>
            Create
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MiningHardwareCreateForm;
