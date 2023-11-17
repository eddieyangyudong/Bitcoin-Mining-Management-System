import React, { useEffect, useState } from 'react';
import { Box, Image, Text, Flex } from "@chakra-ui/react";
import axios from 'axios'; // Make sure to install axios with npm or yarn
import {server} from '../index'

const Home = () => {
    const [indexData, setIndexData] = useState({
        totalHashRate: 0,
        activeMiners: 0,
        miningRevenue: 0,
        bitcoinPrice: 0,
        miningDifficulty: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${server}/index`);
                setIndexData(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Flex
        height="70vh" 
        width="full" 
        direction="column" 
        justifyContent="center" 
        alignItems="center" 
        bgColor="white.900"
        >
          <Text fontSize={'3xl'} fontWeight={'bold'} color={'blackAlpha.900'}>
            Bitcoin Price: {indexData.bitcoinPrice} USD
          </Text>
          <Text fontSize={'3xl'} fontWeight={'bold'} color={'blackAlpha.900'} mt={'10px'}>
            Total Hash Rate: {indexData.totalHashRate.toFixed(2)} TH/s
          </Text>
          <Text fontSize={'3xl'} fontWeight={'bold'} color={'blackAlpha.900'} mt={'10px'}>
            Active Miners: {indexData.activeMiners}
          </Text>
          <Text fontSize={'3xl'} fontWeight={'bold'} color={'blackAlpha.900'} mt={'10px'}>
            Mining Revenue: ${indexData.miningRevenue.toFixed(2)}
          </Text>
          <Text fontSize={'3xl'} fontWeight={'bold'} color={'blackAlpha.900'} mt={'10px'}>
            Mining Difficulty: {indexData.miningDifficulty}
          </Text>
        </Flex>
    );
}

export default Home;

