import { object, string, array, record, any, optional, boolean, nullable } from "superstruct";
const EventId = object({
  txDigest: string(),
  eventSeq: string()
});
const SuiEvent = object({
  id: EventId,
  // Move package where this event was emitted.
  packageId: string(),
  // Move module where this event was emitted.
  transactionModule: string(),
  // Sender's Sui address.
  sender: string(),
  // Move event type.
  type: string(),
  // Parsed json value of the event
  parsedJson: optional(record(string(), any())),
  // Base 58 encoded bcs bytes of the move event
  bcs: optional(string()),
  timestampMs: optional(string())
});
const PaginatedEvents = object({
  data: array(SuiEvent),
  nextCursor: nullable(EventId),
  hasNextPage: boolean()
});
function getEventSender(event) {
  return event.sender;
}
function getEventPackage(event) {
  return event.packageId;
}
export {
  EventId,
  PaginatedEvents,
  SuiEvent,
  getEventPackage,
  getEventSender
};
//# sourceMappingURL=events.js.map
