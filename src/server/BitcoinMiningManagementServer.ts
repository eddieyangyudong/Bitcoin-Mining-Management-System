import express from 'express';
import bodyParser from 'body-parser';
import { PortsGlobal, COINGECKO_BASE_URL, BLOCKCHAIN_BASE_URL } from './ServerDataDefinitions';
import axios from 'axios';
import { Hardware, User } from './GlobalDefinitions';
import cors from 'cors';

let debug = true;

if (!debug) {
    console.log = () => { };
}



const app = express();
let miningHardwareData = require("./mining_hardware_data.json");
const miningStaticsData = require("./mining_statistics_data.json");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users: User[] = [];
const JWT_SECRET = 'bitcoinminingmanagementsystem_jwtsecret_test'; 
let nextId = miningHardwareData[miningHardwareData.length - 1].id + 1;
const miningHardwares = miningHardwareData.reduce((acc:any, item:Hardware) => {
    acc[item.id] = item;
    return acc;
}, {});
const miningHardwaresNameToId = miningHardwareData.reduce((acc:any, item:Hardware)=> {
    acc[item.name] = item.id;
    return acc;
}, {});

app.use(cors({
    origin: 'http://localhost:3000'
  }));
app.use(bodyParser.json());

/**
 * 
 * signup/ login: deal with user
 * 
 * 
 * index:
 * hash rate, num active miners, mining revenue
 * bitcoin price
 * mining difficulty
 * 
 * manage:
 * add edit delete mining hardware
 * 
 * analysis:
 * - During a 10 day period how many hashes does an Antminer S1 expect to   complete?
 * - We would expect to mine 7 bitcoin every 10 ExaHash. How many bitcoin does an Antminer S1 expect to win over 10 days?
 * - Our Antminer S1 really won 1 bitcoin over a 10 day period. What percent of expected yield did it achieve? What would we expect the miners average hashrate to have been over the period?
 */


app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).send('User already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ username, passwordHash });
  res.status(201).send('User created successfully.');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);

  if (user && await bcrypt.compare(password, user.passwordHash)) {
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).send('Invalid credentials.');
});



app.get('/index', async (req: express.Request, res: express.Response) => {
    const bitcoinPriceResp = await axios.get(`${COINGECKO_BASE_URL}/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`);
    const miningDifficultyResp = await axios.get(`${BLOCKCHAIN_BASE_URL}/q/getdifficulty`);
    const bitcoinPrice = bitcoinPriceResp.data.bitcoin.usd;
    const miningDifficulty = miningDifficultyResp.data;
    const result = {
        ...miningStaticsData,
        bitcoinPrice,
        miningDifficulty,
    };
    res.status(200).send(result);
})

app.get("/mininghardware", (req: express.Request, res: express.Response) => {
    const result = miningHardwareData;
    res.status(200).send(result);
})

app.post("/miningHardware", (req: express.Request, res: express.Response) => {
    const {name, location, hashRate} = req.body;
    if (name in miningHardwaresNameToId) {
        res.status(400).send(`Name ${name} already exists.`);
        return;
    }
    try {
        const id = nextId++;
        const newHardware: Hardware = {
            id: id,
            name: name,
            location: location,
            hashRate: hashRate
        };
        miningHardwareData.push(newHardware);
        miningHardwares[id] = {
            id,
            name,
            location,
            hashRate,
        };
        miningHardwaresNameToId[name] = id;
        res.status(200).send(newHardware);
    } catch(e) {
        nextId--;
        res.status(400).send(e);
    }
})


app.put("/miningHardware/:id", (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const {name, location, hashRate} = req.body;
    if (!(id in miningHardwares)) {
        res.status(400).send(`id: ${id} doesn't exist.`);
        return;
    }
    const hardware = miningHardwares[id];
    if (typeof(name)==="string") {
        const oldName = hardware.name;
        hardware.name = name;
        delete miningHardwaresNameToId[oldName];
        miningHardwaresNameToId[name] = id;
    }
    if (typeof(location)==="string") {
        hardware.location = location;
    }
    if (typeof(hashRate)==="string") {
        hardware.hashRate = hashRate;
    }
    res.status(200).send();
})

app.delete("/miningHardware/:id", (req: express.Request, res: express.Response) => {
    try {
        const id = req.params.id;
        const hardware = miningHardwares[id];
        const name = hardware.name;
        miningHardwareData = miningHardwareData.filter((i: Hardware) => i.id !== parseInt(id));

        delete miningHardwares[id];
        delete miningHardwaresNameToId[name];
        res.status(200).send(hardware);
    } catch (e) {
        res.status(400).send(e);
    }
})


// get the port we should be using
const port = PortsGlobal.serverPort;
// start the app and test it
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


export default app;
