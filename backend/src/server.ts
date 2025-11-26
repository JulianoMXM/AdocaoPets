import 'dotenv/config'
import express from 'express'
import { main } from './db/conn.js'
import { router as UserRoutes} from './routes/UserRoutes.js'
import { router as PetRoutes} from './routes/PetRoutes.js'
const app = express()

//  JSON configuration

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json())

//  Door used

main().then(() => {
    app.listen(3000, () => {
        console.log('Server Working')
    })
})
    
//  Routes

app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)