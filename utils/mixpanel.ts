//Import Mixpanel API
import {Mixpanel} from 'mixpanel-react-native';

const mixpanelToken = process.env['MIXPANEL_TOKEN'] ?? '';

// Set up an instance of Mixpanel
const trackAutomaticEvents = false;
const mixpanel = new Mixpanel(mixpanelToken, trackAutomaticEvents);
mixpanel.init();

export default mixpanel;
