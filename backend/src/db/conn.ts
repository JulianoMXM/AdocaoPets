import mongoose from 'mongoose';

export async function main(){

    const DB_USER = process.env.DB_USER
    const DB_PASSWORD = process.env.DB_PASSWORD

    try{
        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@projetosunect.wtzr5ke.mongodb.net/`)
        console.log('Connected');
    } catch(error) {
        if(error instanceof Error){
            console.log('Error while connecting: ' + error.message)
        } else {
            console.log('Unknown error while connecting: ' + error)
        }
        
    }
}