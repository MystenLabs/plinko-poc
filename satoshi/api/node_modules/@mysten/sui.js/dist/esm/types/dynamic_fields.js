import { any, array, boolean, literal, nullable, number, object, string, union } from "superstruct";
const DynamicFieldType = union([literal("DynamicField"), literal("DynamicObject")]);
const DynamicFieldName = object({
  type: string(),
  value: any()
});
const DynamicFieldInfo = object({
  name: DynamicFieldName,
  bcsName: string(),
  type: DynamicFieldType,
  objectType: string(),
  objectId: string(),
  version: number(),
  digest: string()
});
const DynamicFieldPage = object({
  data: array(DynamicFieldInfo),
  nextCursor: nullable(string()),
  hasNextPage: boolean()
});
export {
  DynamicFieldInfo,
  DynamicFieldName,
  DynamicFieldPage,
  DynamicFieldType
};
//# sourceMappingURL=dynamic_fields.js.map
