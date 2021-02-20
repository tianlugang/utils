import { hasOwnProperty } from '../base'
export const isMethod = <T>(obj: T, name: string) => hasOwnProperty(obj, name) && typeof (obj as any)[name] === 'function';