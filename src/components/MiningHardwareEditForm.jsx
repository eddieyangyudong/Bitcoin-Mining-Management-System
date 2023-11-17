import React, { useState, useEffect } from 'react';
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

const MiningHardwareEditForm = ({ isOpen, hardware, onEdit, onClose }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [hashRate, setHashRate] = useState('');

  useEffect(() => {
    if (hardware) {
      setName(hardware.name);
      setLocation(hardware.location);
      setHashRate(hardware.hashRate);
    }
  }, [hardware]);

  const handleEdit = () => {
    // Call the onEdit function with the updated hardware details
    onEdit({
      ...hardware,
      name,
      location,
      hashRate,
    });
    onClose(); // Close the modal after saving changes
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Hardware</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter hardware name" />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Location</FormLabel>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter hardware location" />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Hash Rate</FormLabel>
            <Input value={hashRate} onChange={(e) => setHashRate(e.target.value)} placeholder="Enter hardware hash rate" />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleEdit}>
            Save Changes
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MiningHardwareEditForm;
