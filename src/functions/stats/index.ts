import { handlerPath } from "@libs/handler-resolver";



export const getMonthlyStats = {
    handler: `${handlerPath(__dirname)}/handler.getMonthlyStats`,
    events: [
        {
            http: {
                method: 'get',
                path: '/expense/stats',
                authorizer: 'verifyAuth',
            }
        }
    ]
}

const CreateBudgetSchema = {
    type: "object",
    properties: {
        budget: { type: 'number' },
        yearMonth: { type: 'string' }
    },
    required: ['budget', 'yearMonth']
}

export const createMonthlyBudget = {
    handler: `${handlerPath(__dirname)}/handler.createMonthlyBudget`,
    events: [
        {
            http: {
                method: 'post',
                path: '/expense/budget',
                request: {
                    schemas: {
                        'application/json': CreateBudgetSchema
                    }
                },
                authorizer: 'verifyAuth',
            }
        }
    ]
}

const UpdateBudgetSchema = {
    type: "object",
    properties: {
        budget: { type: 'number' }
    },
    required: ['budget']
}

export const updateMonthlyBudget = {
    handler: `${handlerPath(__dirname)}/handler.updateMonthlyBudget`,
    events: [
        {
            http: {
                method: 'patch',
                path: '/expense/budget/{id}',
                request: {
                    schemas: {
                        'application/json': UpdateBudgetSchema
                    }
                },
                authorizer: 'verifyAuth',
            }
        }
    ]
}