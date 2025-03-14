import { handlerPath } from "@libs/handler-resolver"

const LoginSchema = {
    type: "object",
    properties: {
        loginProvider: { type: 'string' },
        accessToken: { type: 'string' },
    },
    required: ['loginProvider', 'accessToken']
}

export const login = {
    handler: `${handlerPath(__dirname)}/handler.login`,
    events: [
        {
            http: {
                method: 'post',
                path: '/login',
                request: {
                    schemas: {
                        'application/json': LoginSchema
                    }
                }
            }
        }
    ]
}