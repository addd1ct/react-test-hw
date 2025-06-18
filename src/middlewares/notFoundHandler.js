import createHttpError from 'http-errors';

export function notFoundHandler(_, __, next) {
  next(createHttpError(404, 'Route not found'));
}
