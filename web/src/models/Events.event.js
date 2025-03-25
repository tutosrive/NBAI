export default class Events extends EventTarget {
  /**
   * Spread an event, this is used to propague events for example to "PlayPlayer" or "SunkenShip"
   * @param {*} event_name
   * @param {*} data
   */
  spread(event_name, data) {
    document.dispatchEvent(new CustomEvent(event_name, { detail: data }));
  }
}
