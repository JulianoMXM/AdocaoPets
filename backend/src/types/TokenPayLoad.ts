import jwt from 'jsonwebtoken'

export interface ITokenPayLoad extends jwt.JwtPayload {

    id: string,
    password: string

}