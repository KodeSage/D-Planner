# Decentralised Planner(D-Planner)

- This is a blockchain event scheduler and RSVP Dapp. 

### Completed Files
- `smartcontract` folder ✅
- `subgraph` folder ✅
- `frontend` folder  ✅

### Tools and Protocols Used
- `Polygon Blockchain`: (mumbia testnet)
- `TheGraph`: (Protocol used for building the subgraph)
- `Languages`: (Solidity, Typescript, Javascript)
- `Dev Environment`: (Hardhat Toolbox)
- `Code Editor`: ( VSCode)
- `Frontend Toolkits` (React, Next.js, ethers.js, Rainbowkit, Web3.Storage, and The Graph, Moralis)
- `Tests` - Mocha and Chai

### Aim of The DAPP
 - The D-Planner web3-native Eventbrite, except attendees need to deposit Matic to RSVP and will get it back upon them checking in at the event.
 
### Consequences
 - After a period of 7 days, if the attendees that checked in at the event did not withdraw thier matic tokens , the owner of the event will withdrwal thier matic tokens
 
## Best Practices Used in the DAPP

- Used `Check-Effect Interaction and Pull-Payment` Design Pattern in Writing the SmartContract Code
- For Efficient Gas Optimization `external` modifer was used in different function calls
- eventsID are stored in `Bytes32` Datatype instead of `uint`.
