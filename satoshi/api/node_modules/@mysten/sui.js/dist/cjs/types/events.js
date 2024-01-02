"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var events_exports = {};
__export(events_exports, {
  EventId: () => EventId,
  PaginatedEvents: () => PaginatedEvents,
  SuiEvent: () => SuiEvent,
  getEventPackage: () => getEventPackage,
  getEventSender: () => getEventSender
});
module.exports = __toCommonJS(events_exports);
var import_superstruct = require("superstruct");
const EventId = (0, import_superstruct.object)({
  txDigest: (0, import_superstruct.string)(),
  eventSeq: (0, import_superstruct.string)()
});
const SuiEvent = (0, import_superstruct.object)({
  id: EventId,
  // Move package where this event was emitted.
  packageId: (0, import_superstruct.string)(),
  // Move module where this event was emitted.
  transactionModule: (0, import_superstruct.string)(),
  // Sender's Sui address.
  sender: (0, import_superstruct.string)(),
  // Move event type.
  type: (0, import_superstruct.string)(),
  // Parsed json value of the event
  parsedJson: (0, import_superstruct.optional)((0, import_superstruct.record)((0, import_superstruct.string)(), (0, import_superstruct.any)())),
  // Base 58 encoded bcs bytes of the move event
  bcs: (0, import_superstruct.optional)((0, import_superstruct.string)()),
  timestampMs: (0, import_superstruct.optional)((0, import_superstruct.string)())
});
const PaginatedEvents = (0, import_superstruct.object)({
  data: (0, import_superstruct.array)(SuiEvent),
  nextCursor: (0, import_superstruct.nullable)(EventId),
  hasNextPage: (0, import_superstruct.boolean)()
});
function getEventSender(event) {
  return event.sender;
}
function getEventPackage(event) {
  return event.packageId;
}
//# sourceMappingURL=events.js.map
