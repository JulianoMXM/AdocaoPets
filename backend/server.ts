import 'dotenv/config'
import express from 'express'
import { main } from './db/conn'
const app = express()

//  Configuração de leitura de JSON

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json())

//  Porta utilizada

main().then(() => {
    app.listen(3000, () => {
        console.log('Servidor Rodando')
    })
})
    
//  Rotas da API

app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)