const axios = require('axios');
const { pagerDutyEventsApiUrl, pagerDutyRoutingKey } = require('./config');

const createAlert = async (locationName, modentoUrl) => {
  const eventPayload = {
    routing_key: pagerDutyRoutingKey,
    event_action: 'trigger',
    payload: {
      summary: `${locationName} Modento Bridge Down`,
      severity: 'critical',
      source: modentoUrl,
      custom_details: {
        service: 'modento',
        location: locationName,
      },
    },
  };

  try {
    const response = await axios.post(pagerDutyEventsApiUrl, eventPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Alert created successfully:', response.data);
  } catch (error) {
    console.error('Error creating alert:', error.response ? error.response.data : error.message);
  }
};

module.exports = { createAlert };
