export class ApiResponseHelper {
  static success<T>(data: T, requestId?: string) {
    return {
      data,
      meta: {
        requestId: requestId || crypto.randomUUID(),
      },
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    pageSize: number,
    total: number,
    requestId?: string,
  ) {
    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        hasNext: page * pageSize < total,
        requestId: requestId || crypto.randomUUID(),
      },
    };
  }

  static cursorPaginated<T>(
    data: T[],
    cursor: string | null,
    limit: number,
    requestId?: string,
  ) {
    return {
      data,
      meta: {
        cursor,
        limit,
        hasNext: data.length === limit,
        requestId: requestId || crypto.randomUUID(),
      },
    };
  }

  static error(
    code: string,
    message: string,
    requestId?: string,
    details?: Record<string, unknown>,
  ) {
    return {
      error: {
        code,
        message,
        ...(details ? { details } : {}),
        requestId: requestId || crypto.randomUUID(),
      },
    };
  }
}
