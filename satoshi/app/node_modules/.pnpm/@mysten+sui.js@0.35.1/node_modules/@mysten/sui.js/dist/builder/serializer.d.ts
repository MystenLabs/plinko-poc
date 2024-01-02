import { SuiJsonValue, SuiMoveNormalizedType } from '../types';
export declare function isTxContext(param: SuiMoveNormalizedType): boolean;
export declare function getPureSerializationType(normalizedType: SuiMoveNormalizedType, argVal: SuiJsonValue | undefined): string | undefined;
