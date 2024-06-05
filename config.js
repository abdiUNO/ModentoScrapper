require('dotenv').config();

module.exports = {
  modentoUrl: process.env.MODENTO_URL,
  apiKey: process.env.API_KEY,
  pagerDutyEventsApiUrl: process.env.PAGERDUTY_EVENTS_API_URL,
  pagerDutyRoutingKey: process.env.PAGERDUTY_ROUTING_KEY,
};