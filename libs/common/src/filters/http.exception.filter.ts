/*
 * @Author: Cookie
 * @Description:
 */
import { FastifyReply, FastifyRequest } from 'fastify';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

import { BusinessException } from '../exceptions';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();

		const response = ctx.getResponse<FastifyReply>();
		const request = ctx.getRequest<FastifyRequest>();
		const status = exception.getStatus();

		request.log.error(exception);

		// 处理业务异常
		if (exception instanceof BusinessException) {
			const error = exception.getResponse();
			response.status(HttpStatus.OK).send({
				data: null,
				status: error['code'],
				extra: {},
				message: error['message'],
				success: false,
			});
			return;
		}

		// 其它异常处理
		response.status(status).send({
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url,
			message: exception.getResponse(),
		});
	}
}
