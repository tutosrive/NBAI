export default class Events extends EventTarget {
  /**
   * Spread an event, this is used to propague events for example to "PlayPlayer" or "SunkenShip"
   * @param {String} event_name Descriptive name of the event
   * @param {any} data Any data to send with the event...
   */
  spread(event_name, data) {
    document.dispatchEvent(new CustomEvent(event_name, { detail: data }));
  }
  
}
