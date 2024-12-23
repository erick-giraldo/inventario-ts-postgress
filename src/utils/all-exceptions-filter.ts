import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { MongoError } from 'mongodb';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
  
      const { status, message, duplicateValue } = (() => {
        if (exception instanceof MongoError && exception.code === 11000) {
          const match = exception.message.match(/dup key: { (\w+): "([^"]+)" }/);
          
          return match 
            ? {
                status: HttpStatus.CONFLICT,
                message: `Error: Duplicate ${match[1]}: ${match[2]}`,
                duplicateValue: { field: match[1], value: match[2] }
              }
            : {
                status: HttpStatus.CONFLICT,
                message: 'Duplicate key error',
                duplicateValue: null
              };
        }
  
        if (exception instanceof HttpException) {
          return {
            status: exception.getStatus(),
            message: exception.getResponse() as string,
            duplicateValue: null
          };
        }
  
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
          duplicateValue: null
        };
      })();
  
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
        ...(duplicateValue && { duplicateValue }),
      });
    }
  }