/** @format */

import {
	Address,
	ipfs,
	json,
	Bytes,
	dataSource,
} from "@graphprotocol/graph-ts";
import {
	ConfirmedAttendee,
	NewEventCreated,
	NewRSVP,
	DepositsPaidOut,
} from "../generated/DPlanner/DPlanner";

import {
	Account,
	RSVP,
	Confirmation,
	Event,
	EventMetadata,
} from "../generated/schema";
import { integer } from "@protofire/subgraph-toolkit";

import { EventMetadata as EventMetadataTemplate } from "../generated/templates";

export function handleNewEventCreated(event: NewEventCreated): void {
	let newEvent = Event.load(event.params.eventID.toHex());
	if (newEvent == null) {
		newEvent = new Event(event.params.eventID.toHex());
		newEvent.eventID = event.params.eventID;
		newEvent.eventOwner = event.params.creatorAddress;
		newEvent.eventTimestamp = event.params.eventTimestamp;
		newEvent.maxCapacity = event.params.maxCapacity;
		newEvent.deposit = event.params.deposit;
		newEvent.paidOut = false;
		newEvent.totalRSVPs = integer.ZERO;
		newEvent.totalConfirmedAttendees = integer.ZERO;
		const metadata = event.params.eventDataCID + "/data.json";
		newEvent.ipfsURI = metadata;

		EventMetadataTemplate.create(metadata);
	}
	newEvent.save();
}

function getOrCreateAccount(address: Address): Account {
	let account = Account.load(address.toHex());
	if (account == null) {
		account = new Account(address.toHex());
		account.totalRSVPs = integer.ZERO;
		account.totalAttendedEvents = integer.ZERO;
		account.save();
	}
	return account;
}

export function handleNewRSVP(event: NewRSVP): void {
	let id = event.params.eventID.toHex() + event.params.attendeeAddress.toHex();
	let newRSVP = RSVP.load(id);
	let account = getOrCreateAccount(event.params.attendeeAddress);
	let thisEvent = Event.load(event.params.eventID.toHex());
	if (newRSVP == null && thisEvent != null) {
		newRSVP = new RSVP(id);
		newRSVP.attendee = account.id;
		newRSVP.event = thisEvent.id;
		newRSVP.save();
		thisEvent.totalRSVPs = integer.increment(thisEvent.totalRSVPs);
		thisEvent.save();
		account.totalRSVPs = integer.increment(account.totalRSVPs);
		account.save();
	}
}

export function handleConfirmedAttendee(event: ConfirmedAttendee): void {
	let id = event.params.eventID.toHex() + event.params.attendeeAddress.toHex();
	let newConfirmation = Confirmation.load(id);
	let account = getOrCreateAccount(event.params.attendeeAddress);
	let thisEvent = Event.load(event.params.eventID.toHex());
	if (newConfirmation == null && thisEvent != null) {
		newConfirmation = new Confirmation(id);
		newConfirmation.attendee = account.id;
		newConfirmation.event = thisEvent.id;
		newConfirmation.save();
		thisEvent.totalConfirmedAttendees = integer.increment(
			thisEvent.totalConfirmedAttendees
		);
		thisEvent.save();
		account.totalAttendedEvents = integer.increment(
			account.totalAttendedEvents
		);
		account.save();
	}
}

export function handleDepositsPaidOut(event: DepositsPaidOut): void {
	let thisEvent = Event.load(event.params.eventID.toHex());
	if (thisEvent) {
		thisEvent.paidOut = true;
		thisEvent.save();
	}
}

export function handleMetadata(content: Bytes): void {
	let videoMetadata = new EventMetadata(dataSource.stringParam());
	const value = json.fromBytes(content).toObject();
	if (value) {
		const name = value.get("name");
		const description = value.get("description");
		const link = value.get("link");
		const imagePath = value.get("image");

		if (name && description && link && imagePath) {
			videoMetadata.name = name.toString();
			videoMetadata.link = link.toString();
			videoMetadata.description = description.toString();
			videoMetadata.imageURL = imagePath.toString();
		}

		videoMetadata.save();
	}
}
