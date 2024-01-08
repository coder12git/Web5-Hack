// Import necessary libraries and modules
import React, { useEffect } from 'react';
import { Web5 } from "@web5/api/browser";
import { dingerProtocolDefinition } from '@/stores/useWeb5Store';

// Define your dingerProtocolDefinition object

const ChatConnect: React.FC = () => {
  useEffect(() => {
    const initDinger = async () => {
      const copyDidElement = document.querySelector('#copy-did');
      const dingForm = document.querySelector('#ding-form');
      const dingErrorElement = document.querySelector('#ding-error');
      const dingProgressElement = document.querySelector('#ding-progress');
      const dingedList = document.querySelector('#dinged-list');
      const dingedByList = document.querySelector('#dinged-by-list');

      const { web5, did: myDid } = await Web5.connect();
      await configureProtocol(web5);

      setInterval(async () => {
        await renderDings(web5, myDid, dingedList, dingedByList);
      }, 2000);

      //@ts-ignore
      copyDidElement.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(myDid);
        } catch (err) {
            //@ts-ignore
          alert('Failed to copy DID: ', err);
        }
      });

      //@ts-ignore
      dingForm.addEventListener('submit', async (event) => {
        // ... (your existing form submission logic)
        event.preventDefault();

//@ts-ignore
  dingErrorElement.textContent = '';
  //@ts-ignore
  dingProgressElement.textContent = '';
//@ts-ignore
  const did = document.querySelector('#did').value;
  //@ts-ignore
  const note = document.querySelector('#note').value;

  if (did.length === 0) {
    //@ts-ignore
    dingErrorElement.textContent = 'DID required';
    return;
  }

  const ding = { dinger: myDid };
  if (note) {
    //@ts-ignore
    ding.note = note;
  }
//@ts-ignore
  dingProgressElement.textContent = 'writing ding to local DWN...';

  try {
    const { record, status } = await web5.dwn.records.write({
      data: ding,
      message: {
        protocol: dingerProtocolDefinition.protocol,
        protocolPath: 'ding',
        schema: 'ding',
        recipient: did
      }
    });

    if (status.code !== 202) {
        //@ts-ignore
      dingErrorElement.textContent = `${status.code} - ${status.detail}`;
      return;
    }

    const shortenedDid = did.substr(0, 22);
    //@ts-ignore
    dingProgressElement.textContent = `Ding written locally! Dinging ${shortenedDid}...`;
//@ts-ignore
    const { status: sendStatus } = await record.send(did);
    console.log('send status', sendStatus);

    if (sendStatus.code !== 202) {
        //@ts-ignore
      dingErrorElement.textContent = `${sendStatus.code} - ${sendStatus.detail}`;
      return;
    }
//@ts-ignore
    dingProgressElement.textContent = `Dinged ${shortenedDid}!`;
  } catch (e) {
    //@ts-ignore
    dingErrorElement.textContent = e.message;
    return;
  }
      });
    };

    initDinger();
  }, []);

  const configureProtocol = async (web5: any) => {
    // ... (your existing configureProtocol function)
    const { protocols, status } = await web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: 'https://dinger.app/protocol'
        }
      }
    });
  
    if (status.code !== 200) {
      alert('Failed to query protocols. check console');
      console.error('Failed to query protocols', status);
  
      return;
    }
  
    // protocol already exists
    if (protocols.length > 0) {
      console.log('protocol already exists');
      return;
    }
  
    // create protocol
    const { status: configureStatus } = await web5.dwn.protocols.configure({
      message: {
        definition: dingerProtocolDefinition
      }
    });
  
    console.log('configure protocol status', configureStatus);
  };

  const renderDings = async (web5: any, myDid: string, dingedList: any, dingedByList: any) => {
    // ... (your existing renderDings function)
    const { records, status } = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: dingerProtocolDefinition.protocol
        }
      }
    });
  
    if (status.code !== 200) {
      alert('Failed to query for dings. check console');
      console.error('Failed to query dings', status);
    }
  
    for (let record of records) {
      const recordExists = document.getElementById(record.id);
      if (recordExists) {
        continue;
      }
  
      const { dinger, note } = await record.data.json();
      if (dinger === myDid) {
        const shortenedDid = record.recipient.substr(0, 22);
        const formattedDing = `[${new Date(record.dateCreated).toLocaleString()}] ${shortenedDid}... - ${note || ''}`;
  
        const dingElement = document.createElement('li');
        dingElement.id = record.id;
        dingElement.textContent = formattedDing;
  
        const dingBackButton = document.createElement('button');
        dingBackButton.className = 'ding-back';
        dingBackButton.textContent = 'Ding agane';
        dingBackButton.dataset.toDing = record.recipient;
  
        dingBackButton.addEventListener('click', event => {
          const didInput = document.querySelector('#did');
          //@ts-ignore
          didInput.value = event.target.dataset.toDing;
        });
  
        dingElement.appendChild(dingBackButton);
        dingedList.appendChild(dingElement);
      } else {
        const shortenedDid = dinger.substr(0, 22);
        const formattedDing = `[${new Date(record.dateCreated).toLocaleString()}] ${shortenedDid}... - ${note || ''}`;
  
        const dingElement = document.createElement('li');
        dingElement.id = record.id;
        dingElement.textContent = formattedDing;
  
        const dingBackButton = document.createElement('button');
        dingBackButton.className = 'ding-back';
        dingBackButton.textContent = 'Ding Back';
        dingBackButton.dataset.toDing = dinger;
  
        dingBackButton.addEventListener('click', event => {
          const didInput = document.querySelector('#did');
          //@ts-ignore
          didInput.value = event.target.dataset.toDing;
        });
  
        dingElement.appendChild(dingBackButton);
        dingedByList.appendChild(dingElement);
      }
    }

  };

  return (
    <div>
      <button id="copy-did">Copy your DID</button>
      <form id="ding-form">
        <p id="ding-error"></p>
        <input type="text" id="did" placeholder="Enter DID" />
        <br />
        <input type="text" id="note" placeholder="Enter note (optional)" />
        <br />
        <button type="submit">Ding</button>
        <span id="ding-progress"></span>
      </form>

      <h2>You Dinged:</h2>
      <ul id="dinged-list">
        {/* List items will be added here dynamically */}
      </ul>

      <h2>You were Dinged by:</h2>
      <ul id="dinged-by-list">
        {/* List items will be added here dynamically */}
      </ul>
    </div>
  );
};

export default ChatConnect;
