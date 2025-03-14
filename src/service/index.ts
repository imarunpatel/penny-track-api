import dynamoDBConnect from "src/model";
import TodoService from "./service";
import AuthService from "./authService";
import CategoryService from "./categoryService";
import ExpenseService from "./expenseService";
import MonthlyTotalService from "./monthlyTotalService";

export const todoService =  new TodoService(dynamoDBConnect())
export const authService = new AuthService(dynamoDBConnect())
export const categoryService = new CategoryService(dynamoDBConnect())
export const expenseService = new ExpenseService(dynamoDBConnect())
export const monthlyTotalService = new MonthlyTotalService(dynamoDBConnect())