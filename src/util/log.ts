class Message {
  body: string;
  type: string;
}

export default class Log {
  static messages: Message[];

  constructor() {
    Log.messages = [];
  }

  addMessage(message: Message) {
    Log.messages.push(message);
  }

  readMessage() {
    if (Log.messages.length == 0) {
      return;
    }
    return Log.messages.pop();
  }
}
