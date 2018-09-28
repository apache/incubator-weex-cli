import { ERROR_LIST } from './error-list';
export interface ErrorTip {
    title: string;
    tip: string;
}
export declare function getErrorTip(errorKey: ERROR_LIST): ErrorTip;
