import { RequestManager, HTTPTransport, Client } from "@open-rpc/client-js";
import "superstruct";
import { PACKAGE_VERSION, TARGETED_RPC_VERSION } from "../version.js";
import "./errors.js";
class JsonRpcClient {
  constructor(url, httpHeaders) {
    const transport = new HTTPTransport(url, {
      headers: {
        "Content-Type": "application/json",
        "Client-Sdk-Type": "typescript",
        "Client-Sdk-Version": PACKAGE_VERSION,
        "Client-Target-Api-Version": TARGETED_RPC_VERSION,
        ...httpHeaders
      }
    });
    this.rpcClient = new Client(new RequestManager([transport]));
  }
  async requestWithType(method, args, struct) {
    const req = { method, args };
    const response = await this.request(method, args);
    if (false) {
      const [err] = validate(response, struct);
      if (err) {
        throw new RPCValidationError({
          req,
          result: response,
          cause: err
        });
      }
    }
    return response;
  }
  async request(method, params) {
    return await this.rpcClient.request({ method, params });
  }
}
export {
  JsonRpcClient
};
//# sourceMappingURL=client.js.map
