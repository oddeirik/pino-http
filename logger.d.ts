// Type definitions for pino-http 5.8
// Project: https://github.com/pinojs/pino-http#readme
// Definitions by: Christian Rackerseder <https://github.com/screendriver>
//                 Jeremy Forsythe <https://github.com/jdforsythe>
//                 Griffin Yourick <https://github.com/tough-griff>
//                 Jorge Barnaby <https://github.com/yorch>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.7

import { IncomingMessage, ServerResponse } from "http";
import pino from "pino";

export = PinoHttp;

declare function PinoHttp(
  opts?: PinoHttp.Options,
  stream?: pino.DestinationStream
): PinoHttp.HttpLogger;
declare function PinoHttp(stream?: pino.DestinationStream): PinoHttp.HttpLogger;

declare namespace PinoHttp {
  interface HttpLogger {
    (req: IncomingMessage, res: ServerResponse, next?: () => void): void;
    logger: pino.Logger;
  }
  type ReqId = number | string | object;

  /**
   * Options for pino-http
   *
   * See https://github.com/pinojs/pino-http#pinohttpopts-stream
   */
  interface Options extends pino.LoggerOptions {
    logger?: pino.Logger | undefined;
    genReqId?: GenReqId | undefined;
    useLevel?: pino.Level | undefined;
    stream?: pino.DestinationStream | undefined;
    autoLogging?: boolean | AutoLoggingOptions | undefined;
    customLogLevel?:
      | ((res: ServerResponse, error: Error) => pino.Level)
      | undefined;
    customSuccessMessage?: ((res: ServerResponse) => string) | undefined;
    customErrorMessage?:
      | ((error: Error, res: ServerResponse) => string)
      | undefined;
    customAttributeKeys?: CustomAttributeKeys | undefined;
    wrapSerializers?: boolean | undefined;
    reqCustomProps?:
      | ((req: IncomingMessage, res: ServerResponse) => object)
      | undefined;
    quietReqLogger?: boolean | undefined;
  }

  interface GenReqId {
    (req: IncomingMessage): ReqId;
  }

  interface AutoLoggingOptions {
    ignore?: (req: IncomingMessage) => boolean;
    ignorePaths?: Array<string | RegExp> | undefined;
    getPath?: ((req: IncomingMessage) => string | undefined) | undefined;
  }

  interface CustomAttributeKeys {
    req?: string | undefined;
    res?: string | undefined;
    err?: string | undefined;
    reqId?: string | undefined;
    responseTime?: string | undefined;
  }

  const startTime: unique symbol;
}

declare module "http" {
  interface IncomingMessage {
    id: PinoHttp.ReqId;
    log: pino.Logger;
  }

  interface ServerResponse {
    err?: Error | undefined;
  }

  interface OutgoingMessage {
    [PinoHttp.startTime]: number;
  }
}
