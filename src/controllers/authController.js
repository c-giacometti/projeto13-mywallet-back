import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { db } from '../dbStrategy/mongodb.js';

export async function postLogin(req, res) {

    const userLoginInfo = req.body;

    try {
        const userExists = await db.collection('users').findOne({ email: userLoginInfo.email });
        const correctPassword = bcrypt.compareSync(userLoginInfo.password, userExists.password);

        if(userExists && correctPassword){
            const token = uuid();

            await db.collection('sessions').insertOne({
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

}

export async function postSignUp(req, res) {

    const userSignUpInfo = req.body;
    const cryptoPassword = bcrypt.hashSync(userSignUpInfo.password, 10);

    try {

        /* const alreadyRegistered = await db.collection('users').findOne({ email: userSignUpInfo.email });

        if(alreadyRegistered){
            return res.send('Email já cadastrado').status(400);
        } else { */
            await db.collection('users').insertOne({ userSignUpInfo });
            return res.status(201).send('Usuário cadastrado com sucesso');
        /* } */
        
    }

    catch(error){
        return res.sendStatus(500);
    }

}