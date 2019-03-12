import { IncomingMessage, ServerResponse } from "http";
import {responseJson} from '../lib/util';
module.exports = (_: IncomingMessage, res: ServerResponse) => {
    responseJson(res, {
        up: true
    })
};