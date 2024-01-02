import { RequestManager, HTTPTransport, Client } from "@open-rpc/client-js";
import { PACKAGE_VERSION, TARGETED_RPC_VERSION } from "../version.js";
import { WebsocketClient } from "../rpc/websocket-client.js";
class SuiHTTPTransport {
  constructor({
    url,
    websocket: { url: websocketUrl, ...websocketOptions } = {},
    rpc
  }) {
    const transport = new HTTPTransport(rpc?.url ?? url, {
      headers: {
        "Content-Type": "application/json",
        "Client-Sdk-Type": "typescript",
        "Client-Sdk-Version": PACKAGE_VERSION,
        "Client-Target-Api-Version": TARGETED_RPC_VERSION,
        ...rpc?.headers
      }
    });
    this.rpcClient = new Client(new RequestManager([transport]));
    this.websocketClient = new WebsocketClient(websocketUrl ?? url, websocketOptions);
  }
  async request(input) {
    return await this.rpcClient.request(input);
  }
  async subscribe(input) {
    const unsubscribe = await this.websocketClient.request(input);
    return async () => !!await unsubscribe();
  }
}
export {
  SuiHTTPTransport
};
//# sourceMappingURL=http-transport.js.map
