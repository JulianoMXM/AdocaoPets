import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
const app = express();

//  Configuração de leitura de JSON

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

//  Porta utilizada

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

mongoose
    .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@projetosunect.wtzr5ke.mongodb.net/`
)
    .then(() => {
        console.log('Conectado');
        app.listen(3000);
    })
    .catch((error) => {
        console.error('Erro ao conectar ao banco:', error);
    })
    
//  Rotas da API