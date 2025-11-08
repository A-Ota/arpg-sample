export type Event = {
  type: 'message';
  messages: string[];
} | {
  type: 'other';
}