import { IncomingMessage, ServerResponse } from "http";
import { createError, json } from "micro";

export type HttpErrorResponse = Error & {
  statusCode?: number;
  originalError?: Error;
};

export const responseJson = (
  res: ServerResponse,
  body: object = {},
  status: number = 200,
  headers: object = {}
) => {
  const response = {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ...headers
    },
    body: JSON.stringify(body)
  };

  res.writeHead(response.statusCode, response.headers);
  res.write(response.body);
  res.end();
};

export const responseError = (
  res: ServerResponse,
  { statusCode, message }: HttpErrorResponse
) => {
  res.writeHead(statusCode || 400, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  });
  res.write(JSON.stringify({ statusCode, message }));
  res.end();
};

export const isPost = async (req: IncomingMessage) => {
  if (!isPostRequest(req)) {
    throw createError(400, "POST request is required");
  }
  return json(req);
};

export const isOptions = (req: IncomingMessage) => {
  // @ts-ignore
  return req.method.toLowerCase() === "OPTIONS".toLowerCase();
};
export const isPostRequest = (req: IncomingMessage) => {
  // @ts-ignore
  return req.method.toLowerCase() === "POST".toLowerCase();
};

/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object
): Promise<[U | null, T | undefined]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        Object.assign(err, errorExt);
      }

      return [err, undefined];
    });
}