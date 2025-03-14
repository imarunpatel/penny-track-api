import { handlerPath } from "@libs/handler-resolver";


const CategorySchema = {
    type: "object",
    properties: {
        name: { type: 'string' },
    },
    required: ['name']
}

export const createCategory = {
    handler: `${handlerPath(__dirname)}/handler.createCategory`,
    events: [
        {
            http: {
                method: 'post',
                path: '/category',
                request: {
                    schemas: {
                        'application/json': CategorySchema
                    }
                },
                authorizer: 'verifyAuth',
            },
        },
    ],
}

export const deleteCategory = {
    handler: `${handlerPath(__dirname)}/handler.deleteCategory`,
    events: [
        {
            http: {
                method: 'delete',
                path: '/category/{id}',
                authorizer: 'verifyAuth',
            },
        },
    ],
}

export const getAllCategory = {
    handler: `${handlerPath(__dirname)}/handler.getAllCategory`,
    events: [
        {
            http: {
                method: 'get',
                path: '/category',
                authorizer: 'verifyAuth',
            },
        },
    ],
}