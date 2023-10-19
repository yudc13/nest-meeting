import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import Handlebars from 'handlebars';
import { REQUEST_USER_KEY, RequestUser } from '../constant/jwt.constant';
import { Reflector } from '@nestjs/core';
import { LOG_ACTION, LOG_KEY } from '../decorator/log.decorator';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly loggerService: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      const req: Request = context.switchToHttp().getRequest();
      const templates = this.reflector.getAllAndOverride<
        [LOG_ACTION, string, Record<string, string>]
      >(LOG_KEY, [context.getHandler()]);
      if (templates) {
        const reqUser = req[REQUEST_USER_KEY] as RequestUser;
        const allParams = Object.assign(
          { _operatorId: reqUser?.email },
          req.body,
          req.params,
          req.query,
        );
        const [logAction, logTemplate, mapping] = templates;
        let logTmp = logTemplate;
        if (mapping) {
          logTmp += '【';
          Object.keys(mapping).forEach((key) => {
            if (allParams[key]) {
              logTmp += `${mapping[key]}：{{ ${key} }}，`;
            }
          });
          logTmp += '】';
        }
        const template = Handlebars.compile(logTmp);
        const result = template(allParams);
        console.log(logAction, result);
        this.loggerService.createLogger({
          action: logAction,
          content: result,
          createAt: new Date(),
          user: {
            connect: { id: reqUser.userId },
          },
        });
      }
    } catch (e) {}
    return next.handle();
  }
}
