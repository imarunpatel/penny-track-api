import { handlerPath } from "@libs/handler-resolver"

const ExpenseSchema = {
    type: "object",
    properties: {
        categoryId: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        date: { type: 'string' },
        amount: { type: 'number' }
    },
    required: ['categoryId', 'title', 'date', 'amount']
}

export const createExpense = {
    handler: `${handlerPath(__dirname)}/handler.createExpense`,
    events: [
        {
            http: {
                method: 'post',
                path: '/expense',
                request: {
                    schemas: {
                        'application/json': ExpenseSchema
                    }
                },
                authorizer: 'verifyAuth',
            },
        },
    ],
}

export const updateExpense = {
    handler: `${handlerPath(__dirname)}/handler.updateExpense`,
    events: [
        {
            http: {
                method: 'patch',
                path: '/expense/{id}',
                request: {
                    schemas: {
                        'application/json': ExpenseSchema
                    }
                },
                authorizer: 'verifyAuth',
            },
        },
    ],
}

export const deleteExpense = {
    handler: `${handlerPath(__dirname)}/handler.deleteExpense`,
    events: [
        {
            http: {
                method: 'delete',
                path: '/expense/{id}',
                authorizer: 'verifyAuth',
            },
        },
    ],
}

export const getAllExpense = {
    handler: `${handlerPath(__dirname)}/handler.getAllExpense`,
    events: [
        {
            http: {
                method: 'get',
                path: '/expense',
                authorizer: 'verifyAuth',
            },
        },
    ],
}