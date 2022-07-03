import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config;

const mongoClient = new MongoClient('mongodb://127.0.0.1:27017');

let db;

mongoClient.connect(() => {
    db = mongoClient.db('mywalletdb');
})

const objectId = ObjectId;

export { db, objectId };