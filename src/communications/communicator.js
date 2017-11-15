export default class Communicator {
  constructor(domain = '*') {
    this.domain = domain;
  }

  enableListener(handler) {
    // Create IE + others compatible event handler
    const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
    const eventer = window[eventMethod];
    this.messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
    // Listen to message from child window
    eventer(this.messageEvent, e => handler.handleComm(e), false);
  }

  comm(payload) {
    parent.postMessage(JSON.stringify(payload), this.domain);
  }

  broadcast(payload) {
    // Post up the entire chain of parent windows.  This supports our use case
    // of the assessment-player being embedded in dumb content which is then
    // embedded in another controller that can understand this message.
    const parents = new Set();
    let p = parent;
    while (!parents.has(p)) {
      // console.log(`Posting message: ${JSON.stringify(payload)}`);
      p.postMessage(JSON.stringify(payload), this.domain);
      parents.add(p);
      p = p.parent;
    }
  }

}