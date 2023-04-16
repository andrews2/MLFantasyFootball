export type Player = {
    name: string;
    position: string;
    years: string[];
    stats?: Record<string, Record<string, string>>;
}