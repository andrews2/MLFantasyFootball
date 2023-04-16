/**
 * Created By Andrew Shipman
 * 4/15/2023
 */
export type Player = {
    name: string;
    position: string;
    years: string[];
    stats?: Record<string, Record<string, string>>;
}