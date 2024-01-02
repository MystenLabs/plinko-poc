import { array, boolean, nullable, object, string } from "superstruct";
const ResolvedNameServiceNames = object({
  data: array(string()),
  hasNextPage: boolean(),
  nextCursor: nullable(string())
});
export {
  ResolvedNameServiceNames
};
//# sourceMappingURL=name-service.js.map
