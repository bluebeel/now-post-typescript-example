import { IncomingMessage, ServerResponse } from "http";
import {
  responseError,
  responseJson,
  isOptions,
  isPost,
    to
} from "../../lib/util";

export default async (req: IncomingMessage, res: ServerResponse) => {
  if (isOptions(req)) {
    return responseJson(res, {});
  }

  const [parseError, body] = await to(isPost(req));
  if (parseError) {
    return responseError(res, parseError);
  }
  return responseJson(res, { requestBody: body });
};
