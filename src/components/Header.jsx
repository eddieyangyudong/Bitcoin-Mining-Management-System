import { HStack ,Button, Stack ,Image, Text, Box, Spacer } from "@chakra-ui/react";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import headerLogo from '../assets/headerLogo3.png'
import { useEffect, useState } from "react";
import axios from "axios";


const Header = ({ isLoggedIn, onLogout }) => {
    return(
        <>

       
        <Stack p={'3'} bg={'blackAlpha.900'} flexDirection={'row'}  justifyContent={'space-around'} >

        <HStack color={'white'} textTransform={'capitalize'} letterSpacing={'wider'} alignSelf ={'flex-end'} w={'sm'}  >
            <Button variant={'unstyled'} color={'white'}   display={'flex'} flexDirection={'row'}  >
                <NavLink to={"/"} >
                <Image  src={headerLogo} mr={'1'} /> 
                    </ NavLink >
                   <NavLink to={"/"} >
                    <Text color={'rgb(252,211,76)'} >
                        Bitcoin Mining Management System
                        </Text> 
                    </NavLink>
            </Button>
        </HStack>
        <Spacer /> 
        <HStack justifyContent={'space-around'} 
         transition ={"all 0.3s"}
          >

            <Button variant={'unstyled'} color={'rgb(252,211,76)'} mr={'2'} transition ={"all 0.1s"} css={{
            "&:hover":{
              transform :"scale(1.1)",
            }
          }} >
                <Link to="/" >DashBoard</Link>
            </Button>

            <Button variant={'unstyled'} color={'rgb(252,211,76)'} mr={'2' } transition ={"all 0.1s"}  css={{
            "&:hover":{
              transform :"scale(1.1)",
            }
          }}>
                <Link to='/hardwares'>Hardwares</Link>
            </Button>

            <Button variant={'unstyled'} color={'rgb(252,211,76)'} mr={'2' } transition ={"all 0.1s"} css={{
            "&:hover":{
              transform :"scale(1.1)",
            }
          }}>
                <Link to='/analysis'>Analysis</Link>
            </Button>
            <div></div>
            <div></div>

            {isLoggedIn ? (
      <Button onClick={onLogout} colorScheme="red">Logout</Button>
    ) : (
      <Button colorScheme="teal">
<Link to="/login">Login / Sign Up</Link>
      </Button>
      
    )}
      


        </HStack>

        </Stack>



        </>
    )
}


export default Header;

