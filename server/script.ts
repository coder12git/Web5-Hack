import { Web5 } from "@web5/api";
import { protocols } from "@frontend/utils/protocols";
import DocumentUtils from "@frontend/utils/document";
import { Agent } from "@backend/utils";

async function configureProtocols(agent: Agent) {
  console.log("=== CONFIGURE PROTOCOL ===")

  for (const protocol of protocols) {
    const { protocols } = await agent.web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: protocol.protocol,
        }
      }
    })

    if (protocols.length > 0) {
      console.log("Protocol already exists:", protocol.protocol)
      continue
    }

    const { protocol: configuredProtocol, status: localProtocolConfigurationStatus } = await agent.web5.dwn.protocols.configure({
      message: {
        definition: Object.assign({ ...protocol }),
      }
    });

    if (!configuredProtocol) {
      console.log("Failed to configure protocol:", localProtocolConfigurationStatus)
      return
    }

    console.log("Configured protocol on local DWN:", protocol.protocol)
    const { status: remoteProtocolConfigurationStatus } = await configuredProtocol.send(agent.did)

    console.log("Sent protocol to remote DWN")
    console.log(protocol.protocol, remoteProtocolConfigurationStatus)
  }

  console.log("=== END CONFIGURE PROTOCOL ===")
}

async function queryConditions(agent: Agent) {
  console.log("=== QUERY CONDITIONS ===")

  const records = await DocumentUtils.fetchDocumentRecords(agent)
  if (!records) {
    console.log("No records found")
    return
  }

  if (records.length > 0) {
    for (const record of records) {
      // console.log("author:", record.author)
      // console.log("recipient:", record.recipient)
      // Bun.write("records/" + record.id + ".json", JSON.stringify(record))
      // console.log(record.author === record.target)
      console.log(await record.data.json())
    }
  }

  console.log("=== END QUERY CONDITIONS ===")
}

async function createCondition(agent: Agent) {
  console.log("=== CREATE CONDITION ===")

  const record = await DocumentUtils.createDocumentRecord(agent, { name: "test", condition: "command", file: new File([], "", { type: "image/png" }) })

  if (!record) return false

  console.log("=== END CREATE CONDITION ===")
}

async function connect() {
  console.log("=== CONNECT ===")
  const agent = await Web5.connect({
    sync: "5s",
  });

  console.log("=== END CONNECT ===")

  return agent
}
async function main() {
  const agent = await connect()
  await configureProtocols(agent)
  await queryConditions(agent)
  // await createCondition(agent)
  // await queryConditions(agent)
}

main()
