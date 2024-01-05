import { Web5 } from "@web5/api";
import ConditionsProtocol, { type Record, did as ConditionsProtocolDID } from "@frontend/utils/protocols/conditions"
// @ts-ignore
import Result, { ok, err } from "true-myth/result"

export type Agent = {
  web5: Web5,
  did: string
}

export type Status = {
  code: number,
  detail: string,
}

// @ts-ignore
export async function configureProtocol(agent: Agent): Promise<Result<undefined, { type: "REMOTE_PROTOCOL_CONFIGURATION_FAILED" | "LOCAL_PROTOCOL_CONFIGURATION_FAILED" } & { status: Status }>> {
  const { protocols } = await agent.web5.dwn.protocols.query({
    message: {
      filter: {
        protocol: ConditionsProtocol.protocol,
      }
    }
  })

  if (protocols.length > 0)
    return ok(undefined)

  const { protocol, status: localProtocolConfigurationStatus } = await agent.web5.dwn.protocols.configure({
    message: {
      definition: ConditionsProtocol,
    }
  });

  if (!protocol)
    return err({
      type: "LOCAL_PROTOCOL_CONFIGURATION_FAILED",
      status: localProtocolConfigurationStatus,
    })

  const { status: remoteProtocolConfigurationStatus } = await protocol.send(ConditionsProtocolDID)

  if (remoteProtocolConfigurationStatus.code !== 202)
    return err({
      type: "REMOTE_PROTOCOL_CONFIGURATION_FAILED",
      status: remoteProtocolConfigurationStatus,
    })

  return ok(undefined)
}

// @ts-ignore
export async function fetchConditions(agent: Agent): Promise<Result<Record.Condition[], Status>> {
  const { records, status } = await agent.web5.dwn.records.query({
    from: ConditionsProtocolDID,
    message: {
      filter: {
        protocolPath: 'condition',
        schema: ConditionsProtocol.types.condition.schema,
        protocol: ConditionsProtocol.protocol,
      },
      // @ts-ignore
      dateSort: "createdAscending",
    }
  })

  if (!records) {
    if (status.code !== 200)
      return err(status)

    return ok([])
  }

  const conditions: Record.Condition[] = []
  for (const record of records) {
    conditions.push(await record.data.json())
  }

  return ok(conditions)
}

// @ts-ignore
export async function setupAgent(): Promise<Agent> {
  const { web5, did } = await Web5.connect({
    sync: "5s",
  });

  return { web5, did }
}
