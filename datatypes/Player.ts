/**
 * Created By Andrew Shipman
 * 4/15/2023
 */
export type Player = {
    player_id: string;
    name: string;
    position: string;
    years: string[];
    stats?: Record<string, Record<string, string>>;
}