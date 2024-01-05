import { Hono } from "hono";
import { fetchConditions } from "./utils";
import { agentMiddleware } from "./middleware";
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { logger } from "hono/logger"
import { cors } from 'hono/cors'

const app = new Hono()
  .basePath("/api")
  .use("*", cors())
  .use("*", logger())
  .get("/conditions",
    zValidator(
      'query',
      z.object({
        condition: z.string()
      })),
    agentMiddleware, async (c) => {
      const { condition } = c.req.valid("query")
      const res = await fetchConditions(c.get("agent"))
      if (res.isErr)
        return c.json({ error: res.error })

      const conditions = res.value.filter(record => record.condition === condition)
      return c.json(conditions)
    })

export type App = typeof app

export default app
