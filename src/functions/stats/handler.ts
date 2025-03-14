import { formatJSONResponse } from "@libs/api-gateway";
import { projectId } from "@libs/Utilities/constant";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ICategory } from "src/model/Category";
import { categoryService, expenseService, monthlyTotalService } from "src/service";
import { v4 as uuidv4 } from 'uuid';

interface CategoryExpense {
    category: ICategory;
    expense: number;
}

export const getMonthlyStats = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userId = event.requestContext.authorizer.userId;
        const queryParams = event.queryStringParameters;
        const yearMonth = queryParams.yearMonth;

        if(!yearMonth) {
            return formatJSONResponse(400, { code: 400, success: false, error: "Please provide year and month" })
        }
        
        // Convert to India Standard Time (IST)
        const today = new Date();
        const istDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).formatToParts(today);
        
        // Extract the day, month, and year in IST
        const day = istDate.find(part => part.type === 'day').value.padStart(2, '0');
        const month = istDate.find(part => part.type === 'month').value.padStart(2, '0');
        const year = istDate.find(part => part.type === 'year').value;

  
        const startDate = `${year}-${month}-01`;
        const endDate = `${year}-${month}-${day}`;

        const budget = await monthlyTotalService.monthlyBudget(userId, yearMonth);

        // if(budget.length === 0) {
        //     return formatJSONResponse(200, {code: 200, success: true, data: { budgetSet: false, }})
        // }

        const expenses = await expenseService.fetchInDateRange(userId, startDate, endDate);

        const categories = await categoryService.fetchAll(userId);

        const categoryMap = new Map();
        categories.forEach((cat) => {
            categoryMap.set(cat.id, cat);
        })

        const stats: {[date: string]: CategoryExpense[]} = {}

        expenses.forEach(item => {
            const date = item.date;

            if(!stats[date]) {
                stats[date] = [];
            }

            const existingCategory = stats[date].find((entry) => entry.category.id === item.categoryId);

            if(existingCategory) {
                existingCategory.expense += item.amount
            } else {
                stats[date].push({ category: categoryMap.get(item.categoryId) || {id: 'uncategorised', name: 'Uncategorised', projectId, userId}, expense: item.amount })
            }
        })

        const monthlyStats = {
            ...budget[0],
            budgetSet: budget.length > 0,
            categories,
            stats
        }
        return formatJSONResponse(200, { code: 200, success: true, data: monthlyStats })
    } catch(e) {
        return formatJSONResponse(500, { code: 500, success: false, error: 'Internal Server Error' })
    }

}

export const createMonthlyBudget = async (event: APIGatewayProxyEvent) => {
    try {
        const userId = event.requestContext.authorizer.userId;
        const body: { budget: number, yearMonth: string } = JSON.parse(event.body);

        const existingBudget = await monthlyTotalService.monthlyBudget(userId, body.yearMonth);

        if(existingBudget.length > 0) {
            return formatJSONResponse(403, { code: 403, success: false, error: "Already exists" })
        }


        // Create budget for yearMonth
        const budget = await monthlyTotalService.createMonthlyBudget({
            projectId: projectId,
            id: uuidv4(),
            userId,
            budget: body.budget,
            yearMonth: body.yearMonth
        });

        // Fetch expense stats for yearMonth
        const today = new Date();
        const currentDate = String(today.getDate()).padStart(2, '0');
        const startDate = body.yearMonth+'-01';
        const endDate = `${body.yearMonth}-${currentDate}`;

        const expenses = await expenseService.fetchInDateRange(userId, startDate, endDate)

        const stats = {}

        expenses.forEach(item => {
            stats[item.date] = stats[item.date] ? stats[item.date] + item.amount : item.amount
        })

        const monthlyStats = {
            ...budget,
            budgetSet: true,
            stats
        }

        return formatJSONResponse(200, { code: 200, success: true, data: monthlyStats })
    } catch (e) {

    }
}

export const updateMonthlyBudget = async (event: APIGatewayProxyEvent) => {

    try {
        const id = event.pathParameters.id
        const body: { budget: number } = JSON.parse(event.body);

        if(!id || !body.budget) {
            return formatJSONResponse(500, { code: 500, success: false, error: "Invalid request body" })
        }
        const existingBudget = await monthlyTotalService.getMonthlyBudgetById(id);
    
        if(!existingBudget) {
            return formatJSONResponse(404, { code: 404, success: false, error: 'Resource not found' })
        }
        const updated = await monthlyTotalService.updateMonthlyBudget(id, body.budget);
        return formatJSONResponse(200, { code: 200, success: true, data: updated })
    } catch(e) {
        return formatJSONResponse(500, { code: 500, success: false, error: "Internal Server Error" })
    }
}