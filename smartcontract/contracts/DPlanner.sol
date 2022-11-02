// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract DPlanner {
       struct CreateEvent { 
       bytes32 eventId; // Id of the event
       string eventDataCID; // IPFS hash of event name, and details of the event
       address eventOwner; // Address of the Creator of the event
       uint256 eventTimestamp; // Time of the event(saved on the blockchain in seconds)
       uint256 deposit; // Amount to deposit to attend the event
       uint256 maxCapacity; // Max capacity of people who are going to attend the event
       address[] confirmedRSVPs; // ConfirmedRSVPs of people who deposited
       address[] claimedRSVPs; // Those who really attended the event
       bool paidOut;
   }

    mapping(bytes32 => CreateEvent) public idToEvent; // ID to track individual Events


    event NewEventCreated(
    bytes32 eventID,
    address creatorAddress,
    uint256 eventTimestamp,
    uint256 maxCapacity,
    uint256 deposit,
    string eventDataCID
);

event NewRSVP(bytes32 eventID, address attendeeAddress);

event ConfirmedAttendee(bytes32 eventID, address attendeeAddress);

event DepositsPaidOut(bytes32 eventID);

    function createRSVPNewEvent(
    uint256 eventTimestamp,
    uint256 deposit,
    uint256 maximumCapacity,
    string calldata eventDataCID
) external {
    bytes32 eventId = keccak256( 
    abi.encodePacked(
        msg.sender,
        address(this),
        eventTimestamp,
        deposit,
        maximumCapacity
    )
    );
    require(idToEvent[eventId].eventTimestamp == 0, "ALREADY REGISTERED");

    address[] memory confirmedRSVPs;    
    address[] memory claimedRSVPs;

    idToEvent[eventId] = CreateEvent(
    eventId,
    eventDataCID,
    msg.sender,
    eventTimestamp,
    deposit,
   maximumCapacity,
    confirmedRSVPs,
    claimedRSVPs,
    false
);

emit NewEventCreated(
    eventId,
    msg.sender,
    eventTimestamp,
    maximumCapacity,
    deposit,
    eventDataCID
);
}

function createNewRSVP( bytes32 eventId) external payable {
    CreateEvent storage myEvent = idToEvent[eventId];

    require(msg.value == myEvent.deposit, "NOT Enough Token to register for this event");
    require(block.timestamp <= myEvent.eventTimestamp, "Event Already happened");
    require(myEvent.confirmedRSVPs.length < myEvent.maxCapacity, "Max Capacity Reached Already");

    for (uint8 i = 0; i < myEvent.confirmedRSVPs.length; i++) {
        require(myEvent.confirmedRSVPs[i] != msg.sender, "Already Confirmed");
    }

    myEvent.confirmedRSVPs.push(payable(msg.sender));

    emit NewRSVP(eventId, msg.sender);
}

function confirmAttendee(bytes32 eventId, address attendee) public {

    CreateEvent storage myEvent = idToEvent[eventId];
    require(msg.sender == myEvent.eventOwner, "NOT AUTHORIZED");
    address rsvpConfirm;

    for (uint i = 0; i < myEvent.confirmedRSVPs.length; i++) {
        if(myEvent.confirmedRSVPs[i] == attendee){
            rsvpConfirm = myEvent.confirmedRSVPs[i];
        }
    }

    require(rsvpConfirm == attendee, "NO RSVP TO CONFIRM");

    for (uint i = 0; i < myEvent.claimedRSVPs.length; i++) {
        require(myEvent.claimedRSVPs[i] != attendee, "ALREADY CLAIMED");
    }

    require(myEvent.paidOut == false, "ALREADY PAID OUT");

    myEvent.claimedRSVPs.push(attendee);
    (bool sent,) = attendee.call{value: myEvent.deposit}("");
    if (!sent) {
        myEvent.claimedRSVPs.pop();
    }

    require(sent, "Failed to send Ether");

    emit ConfirmedAttendee(eventId, attendee);
}

function confirmAllAttendees(bytes32 eventId) external {
    CreateEvent memory myEvent = idToEvent[eventId];
    require(msg.sender == myEvent.eventOwner, "NOT AUTHORIZED");

    for (uint8 i = 0; i < myEvent.confirmedRSVPs.length; i++) {
        confirmAttendee(eventId, myEvent.confirmedRSVPs[i]);
    }
}

function withdrawUnclaimedDepositsfromEvents(bytes32 eventId) external {
    CreateEvent memory myEvent = idToEvent[eventId];

    require(!myEvent.paidOut, "ALREADY PAID OUT");
    require(
        block.timestamp >= (myEvent.eventTimestamp + 7 days),
        "TOO EARLY"
    );
    require(msg.sender == myEvent.eventOwner, "MUST BE EVENT OWNER");
    uint256 unclaimed = myEvent.confirmedRSVPs.length - myEvent.claimedRSVPs.length;

    uint256 payout = unclaimed * myEvent.deposit;
    myEvent.paidOut = true;
    (bool sent, ) = msg.sender.call{value: payout}("");

    if (!sent) {
        myEvent.paidOut = false;
    }

    require(sent, "Failed to send Ether");

emit DepositsPaidOut(eventId);
}

}