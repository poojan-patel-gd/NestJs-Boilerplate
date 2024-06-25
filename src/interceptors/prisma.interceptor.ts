import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PRISMA_ERRORS } from '../shared/constants/prisma.constants';
import { InvalidFormException } from '../exceptions/invalid.form.exception';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PrismaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // next.handle() is an Observable of the controller's result value
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          const constraint = Array.isArray(error.meta && error.meta['target'])
            ? (error.meta['target'] as string[]).join(', ')
            : 'unknown';
          let errorMessage = error.message;
          const prismaError = PRISMA_ERRORS[error.code];

          if (prismaError) {
            const customMessage = prismaError.replace(
              '{constraint}',
              constraint,
            );

            const errors = {
              [constraint]: customMessage,
            };

            const prismaErrorSplitStr = `invocation:\n\n\n  `;
            errorMessage =
              error.message.split(prismaErrorSplitStr)[1] || errorMessage;

            throw new InvalidFormException(errors, errorMessage);
          } else {
            throw new InvalidFormException({}, errorMessage);
          }
        } else {
          throw error;
        }
      }),
    );
  }
}
