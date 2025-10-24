import { setMatomoConsent } from '@/mtmo';
import { acceptedService, type CookieConsentConfig } from 'vanilla-cookieconsent';

const pluginConfig: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: 'box',
      position: 'bottom right',
      equalWeightButtons: true,
      flipButtons: false,

    },
    preferencesModal: {
      layout: 'box',
      position: 'left',
      equalWeightButtons: true,
      flipButtons: false,
    },
  },

  onModalReady: function() {
    // we need to prevent propagation of the click event as it would interfere with other dialogs, which listen for
    // clicks outside of them, causing them to be closed (because the Accept/Decline buttons are obviously outside...)
    setTimeout(() => {
      const modal = window.document.querySelector('#cc-main');
      if (!modal) return;

      modal.addEventListener('click', function (e) {
        console.log("event", e)
        e.stopPropagation();
      }, false);
    }, 1)
  },

  onFirstConsent: function () {
  },

  onConsent: function () {
    setMatomoConsent(acceptedService('matomo-cookie', 'analytics'))
  },

  onChange: function () {
    setMatomoConsent(acceptedService('matomo-cookie', 'analytics'))
  },

  categories: {
    necessary: {
      readOnly: true,
      enabled: true,
    },
    analytics: {
      services: {
        "matomo-tracking": {
          label: "Matomo Tracking"
        },
        "matomo-cookie": {
          label: "Matomo Cookie",
          cookies: [
            {
              name: /^(_pk|matomo_sessid)/,
            },
          ],
        }
      }
    },
  },

  language: {
    default: 'en',

    translations: {
      en: {
        consentModal: {
          title: "Hello traveller, it's cookie time!",
          description:
            'Our website uses tracking cookies to understand how you interact with it. The tracking will be enabled only if you accept explicitly. <a href="#privacy-policy" data-cc="show-preferencesModal" class="cc__link">Manage preferences</a>',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage preferences',
          //closeIconLabel: 'Close',
        },
        preferencesModal: {
          title: 'Cookie preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Save preferences',
          closeIconLabel: 'Close',
          sections: [
            {
              title: 'Cookie Usage',
              description:
                'We use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="#" class="cc__link">privacy policy</a>.',
            },
            {
              title: 'Strictly necessary cookies',
              description: 'Some cookies are strictly necessary for this site to function properly. These can not be disabled.',
              linkedCategory: 'necessary',
            },
            {
              title: 'Performance and Analytics',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: 'Name',
                  domain: 'Service',
                  description: 'Description',
                  expiration: 'Expiration',
                },
                body: [
                  {
                    name: '_pk_id',
                    domain: 'Matomo Analytics',
                    description:
                      'Cookie set by <a href="https://matomo.org/faq/general/faq_146/">Matomo Analytics.</a>.',
                    expiration: 'Expires after 13 months',
                  },
                  {
                    name: '_pk_ses',
                    domain: 'Matomo Analytics',
                    description:
                      'Cookie set by <a href="https://matomo.org/faq/general/faq_146/">Matomo Analytics.</a>.',
                    expiration: 'Expires after 30 minutes',
                  },
                  {
                    name: '_pk_ref',
                    domain: 'Matomo Analytics',
                    description:
                      'Cookie set by <a href="https://matomo.org/faq/general/faq_146/">Matomo Analytics.</a>.',
                    expiration: 'Expires after 6 months',
                  },
                  {
                    name: '_pk_testcookie',
                    domain: 'Matomo Analytics',
                    description:
                      'Cookie set by <a href="https://matomo.org/faq/general/faq_146/">Matomo Analytics.</a>.',
                    expiration: 'Temporary, removed immediately',
                  },
                  {
                    name: 'matomo_sessid',
                    domain: 'Matomo Analytics',
                    description:
                      'Cookie set by <a href="https://matomo.org/faq/general/faq_146/">Matomo Analytics.</a>.',
                    expiration: 'Expires after 14 days',
                  },

                ],
              },
            },
          ],
        },
      },
    },
  },
};

export default pluginConfig;
