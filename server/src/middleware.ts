import { type Agent, configureProtocol, setupAgent } from "./utils";
import { MiddlewareHandler } from "hono"

let agent: Agent

export const agentMiddleware: MiddlewareHandler<{
  Variables: {
    agent: Agent
  }
}> = async (c, next) => {
  if (!agent)
    agent = await setupAgent()

  const connectionResult = await configureProtocol(agent)
  if (connectionResult.isErr) {
    console.log(connectionResult.error)
    process.exit()
  }

  c.set('agent', agent)
  await next()
}
