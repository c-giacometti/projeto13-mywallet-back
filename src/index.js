import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import joi from 'joi';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const mongoClient = new MongoClient(process.env.MONGO_URI);

app.post('/sign-up', async (req, res) => {

    const userData = req.body;
    const cryptoPassword = bcrypt.hashSync(userData.password, 10);

    try {
        await mongoClient.connect();
        const mywalletdb = mongoClient.db('mywallet');

        const alreadyRegistered = await mywalletdb.collection('users').find({ email: userData.email }).toArray();

        if(alreadyRegistered.length > 0){
            return res.status(400).send('E-mail já cadastrado');
        } else {
            await mywalletdb.collection('users').insertOne({...userData, password: cryptoPassword });
            return res.send('Usuário cadastrado').status(201);
        }
    }

    catch(error){
        mongoClient.close();
        return res.sendStatus(500);
    }
});

app.get('/sign-up', async (req, res) => {

    try {
        await mongoClient.connect();
        const mywalletdb = mongoClient.db("mywallet");

        const user = await mywalletdb.collection('users').find().toArray();

        return res.send(user);
    }

    catch {
        mongoClient.close();
        return res.sendStatus(500);
    }
    
});

app.post('/login', async (req, res) =>{

    const userLoginInfo = req.body;

    try {
        await mongoClient.connect();
        const mywalletdb = mongoClient.db("mywallet");

        const userExists = await mywalletdb.collection('users').findOne({ email: userLoginInfo.email });
        const correctPassword = bcrypt.compareSync(userLoginInfo.password, userExists.password);

        if(userExists && correctPassword){
            const token = uuid();

            await mywalletdb.collection('sessions').insertOne({
                token,
                userId: userExists._id
            });

            return res.status(201).send({ token });

        } else {
            return res.status(401).send('Senha ou email incorretos!');
        }
    }

    catch(error){
       return res.sendStatus(500);
    }

});

app.listen(5000);