import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { WinstonLoggerService } from '../logger/logger.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {

    private readonly logger: WinstonLoggerService;

    constructor() {
        this.logger = new WinstonLoggerService();
    }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = CustomExceptionFilter.getErrorResponse(status, exception);

        console.log('Exception---------------->', exception)
        // this.logger.error(exception.message, request.url, '', exception.response, );

        response.status(status).json(errorResponse);
    }

    private static getErrorResponse(status: number, exception?: any): Record<string, any> {
        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            return {
                message: 'Something went wrong',
                statusCode: status,
            };
        } else if (exception.response) {
            if (exception.message && exception.message.includes('Unique constraint failed')) {
                const field = Object.keys(exception.errors)[0];
                return {
                    message: `${field} already exists`,
                    error: 'Bad Request',
                    statusCode: HttpStatus.BAD_REQUEST,
                };
            } else if (exception.message && exception.message.includes('Foreign key constraint failed')) {
                const field = Object.keys(exception.errors)[0];
                return {
                    message: `You can not delete this ${field}`,
                    error: 'Bad Request',
                    statusCode: HttpStatus.BAD_REQUEST,
                };
            } else {
                return exception.response;
            }
        }

        return {
            message: exception.errors || exception.response?.message || 'An unexpected error occurred',
            error: exception.response?.error,
            statusCode: status
        };
    }
}
