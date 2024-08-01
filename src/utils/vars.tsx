import { atom, useAtom } from "jotai";

export let onProps = false;
export const setOnProps = (val: boolean) => onProps = val;

export const mode_hold_atom = atom<boolean>(false);
export const mode_atom = atom<boolean>(true);