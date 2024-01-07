import { Web5 } from "@web5/api";
import { useState, useEffect } from "react";

export default function Home() {

    const [web5, setWeb5] = useState(null);
    const [myDid, setMyDid] = useState(null);
    const [activeRecipient, setActiveRecipient] = useState(null);

    const [noteValue, setNoteValue] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [recipientDid, setRecipientDid] = useState("");

    const [didCopied, setDidCopied] = useState(false);
    const [showNewChatInput, setShowNewChatInput] = useState(false);

    const [allDings, setAllDings] = useState([]);

    const sortedDings = allDings.sort(
        //@ts-ignore
        (a, b) => new Date(a.timestampWritten) - new Date(b.timestampWritten)
    );

    const groupedDings = allDings.reduce((acc, ding) => {
        //@ts-ignore
        const recipient = ding.sender === myDid ? ding.recipient : ding.sender;
        //@ts-ignore
        if (!acc[recipient]) acc[recipient] = [];
        //@ts-ignore
        acc[recipient].push(ding);
        return acc;
    }, {});

    useEffect(() => {
        const initWeb5 = async () => {
            const { web5, did } = await Web5.connect();
            //@ts-ignore
            setWeb5(web5);
            //@ts-ignore
            setMyDid(did);

            if (web5 && did) {
                await configureProtocol(web5, did);
                await fetchDings(web5, did);
            }
        };
        initWeb5();
    }, []);

    useEffect(() => {
        if (!web5 || !myDid) return;
        const intervalId = setInterval(async () => {
            await fetchDings(web5, myDid);
        }, 2000);

        return () => clearInterval(intervalId);
    }, [web5, myDid]);

    const createProtocolDefinition = () => {
        const dingerProtocolDefinition = {
            protocol: "https://blackgirlbytes.dev/dinger-chat-protocol",
            published: true,
            types: {
                ding: {
                    schema: "https://blackgirlbytes.dev/ding",
                    dataFormats: ["application/json"],
                },
            },
            structure: {
                ding: {
                    $actions: [
                        { who: "anyone", can: "write" },
                        { who: "author", of: "ding", can: "read" },
                        { who: "recipient", of: "ding", can: "read" },
                    ],
                },
            },
        };
        return dingerProtocolDefinition;
    };

    //@ts-ignore
    const queryForProtocol = async (web5) => {
        return await web5.dwn.protocols.query({
            message: {
                filter: {
                    protocol: "https://blackgirlbytes.dev/dinger-chat-protocol",
                },
            },
        });
    };

    //@ts-ignore
    const installProtocolLocally = async (web5, protocolDefinition) => {
        return await web5.dwn.protocols.configure({
            message: {
                definition: protocolDefinition,
            },
        });
    };

    //@ts-ignore
    const configureProtocol = async (web5, did) => {
        const protocolDefinition = await createProtocolDefinition();

        const { protocols: localProtocol, status: localProtocolStatus } =
            await queryForProtocol(web5);
        console.log({ localProtocol, localProtocolStatus });
        if (localProtocolStatus.code !== 200 || localProtocol.length === 0) {

            const { protocol, status } = await installProtocolLocally(web5, protocolDefinition);
            console.log("Protocol installed locally", protocol, status);

            const { status: configureRemoteStatus } = await protocol.send(did);
            console.log("Did the protocol install on the remote DWN?", configureRemoteStatus);
        } else {
            console.log("Protocol already installed");
        }
    };


    const constructDing = () => {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        const ding = {
            sender: myDid,
            note: noteValue,
            recipient: recipientDid,
            timestampWritten: `${currentDate} ${currentTime}`,
        };
        return ding;
    };

    //@ts-ignore
    const writeToDwn = async (ding) => {
        //@ts-ignore
        const { record } = await web5.dwn.records.write({
            data: ding,
            message: {
                protocol: "https://blackgirlbytes.dev/dinger-chat-protocol",
                protocolPath: "ding",
                schema: "https://blackgirlbytes.dev/ding",
                recipient: recipientDid,
            },
        });
        return record;
    };

    //@ts-ignore
    const sendRecord = async (record) => {
        return await record.send(recipientDid);
    };
    //@ts-ignore
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!noteValue.trim()) {
            setErrorMessage('Please type a message before sending.');
            return;
        }

        const ding = constructDing();
        const record = await writeToDwn(ding);
        const { status } = await sendRecord(record);

        console.log("Send record status", status);

        await fetchDings(web5, myDid);
        setNoteValue("");
    };

    const handleCopyDid = async () => {
        if (myDid) {
            try {
                await navigator.clipboard.writeText(myDid);
                setDidCopied(true);
                console.log("DID copied to clipboard");

                setTimeout(() => {
                    setDidCopied(false);
                }, 3000);
            } catch (err) {
                console.log("Failed to copy DID: " + err);
            }
        }
    };

    //@ts-ignore
    const fetchSentMessages = async (web5, did) => {
        const response = await web5.dwn.records.query({
            message: {
                filter: {
                    protocol: "https://blackgirlbytes.dev/dinger-chat-protocol",
                },
            },
        });

        if (response.status.code === 200) {
            const sentDings = await Promise.all(
                //@ts-ignore
                response.records.map(async (record) => {
                    const data = await record.data.json();
                    return data;
                })
            );
            console.log(sentDings, "I sent these dings");
            return sentDings;
        } else {
            console.log("error", response.status);
        }
    };

    //@ts-ignore
    const fetchReceivedMessages = async (web5, did) => {
        const response = await web5.dwn.records.query({
            from: did,
            message: {
                filter: {
                    protocol: "https://blackgirlbytes.dev/dinger-chat-protocol",
                    schema: "https://blackgirlbytes.dev/ding",
                },
            },
        });

        if (response.status.code === 200) {
            const receivedDings = await Promise.all(
                //@ts-ignore
                response.records.map(async (record) => {
                    const data = await record.data.json();
                    return data;
                })
            );
            console.log(receivedDings, "I received these dings");
            return receivedDings;
        } else {
            console.log("error", response.status);
        }
    };

    //@ts-ignore
    const fetchDings = async (web5, did) => {
        const sentMessages = await fetchSentMessages(web5, did);
        const receivedMessages = await fetchReceivedMessages(web5, did);
        const allMessages = [...(sentMessages || []), ...(receivedMessages || [])];
        //@ts-ignore
        setAllDings(allMessages);

    };

    const handleStartNewChat = () => {
        setActiveRecipient(null);
        setShowNewChatInput(true);
    };

    //@ts-ignore
    const handleSetActiveRecipient = (recipient) => {
        setRecipientDid(recipient);
        setActiveRecipient(recipient);
        setShowNewChatInput(false);
    };

    const handleConfirmNewChat = () => {
        //@ts-ignore
        setActiveRecipient(recipientDid);
        //@ts-ignore
        setActiveRecipient(recipientDid);
        setShowNewChatInput(false);
        //@ts-ignore
        if (!groupedDings[recipientDid]) {
            //@ts-ignore
            groupedDings[recipientDid] = [];
        }
    };

    return (
      <div>
      <h1>{myDid}</h1>
      <input placeholder="Enter your message"/>
      <button>Send Message</button>
      </div>
    );
}