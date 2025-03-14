import { formatJSONResponse } from "@libs/api-gateway";
import { APIGatewayProxyEvent } from "aws-lambda";
import IUser from "src/model/User";
import { authService } from "src/service";
import * as jwt from 'jsonwebtoken';
import { projectId } from "@libs/Utilities/constant";
import fetch from 'node-fetch';

interface LoginUserRequest {
    accessToken: string
    loginProvider: string
}

export const login = async (event: APIGatewayProxyEvent) => {

    try {
        let loginBody: LoginUserRequest = JSON.parse(event.body);

        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${loginBody.accessToken}`)
        const userInfo = await response.json() as {id: string; email: string; name: string; picture: string};
    
        const now = new Date().toISOString();
    
        const existingUser = await authService.getUser(userInfo.id);

        if(!existingUser) {
            const newUser: IUser = {
                projectId: projectId,
                userId: userInfo.id,
                name: userInfo.name,
                email: userInfo.email,
                avatar: userInfo.picture,
                loginProvider: loginBody.loginProvider,
                createdAt: now,
                lastLogin: now
            };
            await authService.createUser(newUser);
        } else {
            await authService.updateUser(userInfo.id);
        }

        const token = jwt.sign({ userId: userInfo.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        const expiresAt = Math.floor(Date.now() / 1000) + 23 * 60 * 60; // Setting expire time 1 hour before actual expire
        
        const user = {
            name: userInfo.name,
            email: userInfo.email,
            avatar: userInfo.picture,
            token,
            expiresAt
        }
        return formatJSONResponse(200, { code: 200, success: true, data: user})
    } catch (error) {
        return formatJSONResponse(500, {code: 500, success: false, error: 'Internal Server Error'})
    }
}