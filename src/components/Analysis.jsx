import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, HStack, Text, Input, Button, VStack } from "@chakra-ui/react";
import Loader from './Loader'; // Assuming you have a Loader component
import ErrorComponent from './ErrorComponent'; // Assuming you have an ErrorComponent
import { server } from '..';

const Analysis = () => {
  const [error, setError] = useState(false);
  const [name, setName] = useState('');
  const [days, setDays] = useState('');
  const [btcPerExaHash, setBtcPerExaHash] = useState('');
  const [numBitcoin, setNumBitcoin] = useState('');
  const [expectedHashes, setExpectedHashes] = useState(null);
  const [expectedBitcoins, setExpectedBitcoins] = useState(null);
  const [averageHashRate, setAverageHashRate] = useState(null);
  const [percentage, setPercentage] = useState(null);


  function getHashRatePerSec(hashRateStr) {
    const match = hashRateStr.match(/([\d.]+)\s*([kMGTPE]?)H\/S/i);
    if (!match) {
      throw new Error('Invalid hash rate format');
    }

    const hashRateExtracted = match[1];
    const unit = match[2];

    // Convert the hash rate to hashes per second based on the unit
    const units = { 'k': 1e3, 'M': 1e6, 'G': 1e9, 'T': 1e12, 'P': 1e15, 'E': 1e18 };
    const multiplier = units[unit.toUpperCase()] || 1;
    const hashRate = parseFloat(hashRateExtracted) * multiplier;
    return hashRate;
  }

  function calculateExpectedBitcoins(hashRate, days, btcPerExaHash) {
    const secondsInADay = 24 * 60 * 60;
    const hashRateInEHS = hashRate / 1e18; // Convert hash rate to ExaHash per second (EH/s)
    const totalExahashes = hashRateInEHS * secondsInADay * days;
    return totalExahashes * btcPerExaHash;
  }


  const fetchData = async () => {
    setError(false);

    if (!name) {
      setExpectedHashes(null);
      setExpectedBitcoins(null);
      setPercentage(null);
      setAverageHashRate(null);
      return;
    }
    try {
      const response = await axios.get(`${server}/mininghardware`);
      // Fetch the number of expected hashes to complete
      const hardware = response.data.find(h => h.name.toLowerCase() === name.toLowerCase());
      console.log(hardware);
      
      if (!hardware) {
        console.error('Error: Hardware not found');
        return; // Exit the function if hardware is not found
      }
  
      const hashRate = getHashRatePerSec(hardware.hashRate);
      console.log(hashRate);
      const seconds = days * 24 * 60 * 60;
      setExpectedHashes(hashRate * seconds);
  
      // Ensure days and btcPerExaHash are numbers before calculation
      const daysNum = Number(days);
      const btcPerExaHashNum = Number(btcPerExaHash);
      if (!isNaN(daysNum) && !isNaN(btcPerExaHashNum) && daysNum > 0 && btcPerExaHashNum > 0) {
        const expectedBitcoinsCalc = calculateExpectedBitcoins(hashRate, daysNum, btcPerExaHashNum);
        setExpectedBitcoins(expectedBitcoinsCalc);
      } else {
        setExpectedBitcoins(0);
      }
  
      // Ensure numBitcoin is a number before calculation
      const numBitcoinNum = Number(numBitcoin);
      if (!isNaN(numBitcoinNum) && numBitcoinNum > 0 && expectedBitcoins > 0) {
        setPercentage((numBitcoinNum / expectedBitcoins) * 100);
        setAverageHashRate((numBitcoinNum / expectedBitcoins) * hashRate);
      } else {
        setPercentage(0);
        setAverageHashRate(0);
      }
  
    } catch (error) {
      setError(true);
      console.error('Error fetching data:', error);
    }
  };
  

  // Call fetchData when the component mounts or when the dependencies change
  useEffect(() => {
    fetchData();
  }, [name, days, btcPerExaHash, numBitcoin]);

  if (error) {
    return <ErrorComponent message={"Something wrong happened! Please return to the dashboard page and try again "} />;
  }

  return (
    <Container maxW={'container.xl'}>
      {
        <>
          <HStack textTransform={'capitalize'}
            w={'full'}
            p={'4'}
            fontSize={'2xl'}
            borderBottom={'8px'}
          >
            <Text textAlign={'center'}
              w={'full'}
            >
              Get analytical data for bitcoin Mining Hardwares
            </Text>
          </HStack>

          <HStack w={'full'} overflowX={'auto'} p={'8'} spacing={4}>
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Days" value={days} onChange={(e) => setDays(e.target.value)} />
            <Input placeholder="BTC per ExaHash" value={btcPerExaHash} onChange={(e) => setBtcPerExaHash(e.target.value)} />
            <Input placeholder="Number of Bitcoin" value={numBitcoin} onChange={(e) => setNumBitcoin(e.target.value)} />
          </HStack>


          <VStack align="start" p={6} >
            <Text fontSize="xl" color="black.500" fontWeight="bold">
              Expected Number of Hashes: {expectedHashes}
            </Text>
            <Text fontSize="xl" color="balck.500" fontWeight="bold">
              Expected Number of Bitcoins to Win: {expectedBitcoins}
            </Text>
            <Text fontSize="xl" color="balck.500" fontWeight="bold">
              Percentage of Expected Yield: {percentage} %
            </Text>
            <Text fontSize="xl" color="balck.500" fontWeight="bold">
              Average Hash Rate: {averageHashRate}
            </Text>
          </VStack>

        </>
      }
    </Container>
  );
};

export default Analysis;
