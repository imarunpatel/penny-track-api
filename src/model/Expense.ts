export interface IExpense {
    projectId: string
    userId: string
    id: string
    title: string
    categoryId: string
    amount: number
    description?: string
    date: string
}