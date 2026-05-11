import axios from 'axios';
import { apiNotifications } from '@/api/notifications/api';
import { mpireServiceWorker } from '.';
import defaultSettings from '../../config/defaultSettings';

// const {pwa, useServiceWorker} = defaultSettings;
const pushServerPublicKey =
  'BEEQu35i-gHV59m-9JfaLbtBDRQN1W3su3niYGII7o55iWIe50cLi60h0qkgY4OMY_bAg1Q2rk5VLmdATEdeTmc';

export const isPushNotificationSupported = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
);
const registerValidSW = (swUrl: string) => {
  navigator?.serviceWorker
    .register(swUrl, {
      scope: '/',
    })
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator?.serviceWorker?.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://bit.ly/CRA-PWA.',
              );

              // Execute callback
              // if (config && config.onUpdate) {
              //   config.onUpdate(registration);
              // }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute callback
              // if (config && config.onSuccess) {
              //   config.onSuccess(registration);
              // }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
};
const checkValidServiceWorker = (swUrl: string) => {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        console.log('tim thay service-worker');
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
};
export const createNotificationSubscription = async () => {
  //wait for service worker installation to be ready

  const serviceWorker = await navigator.serviceWorker.ready;

  // subscribe and return the subscription
  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,

    applicationServerKey: pushServerPublicKey,
  });
};

export const getUserSubscription = async () => {
  //wait for service worker installation to be ready, and then

  return navigator?.serviceWorker?.ready
    ?.then((serviceWorker) => {
      return serviceWorker?.pushManager?.getSubscription();
    })
    .then((pushSubscription) => {
      return pushSubscription;
    })
    .catch((err) => {
      return false;
    });
};
export const onSendSubscriptionToPushServer = (userSubscription: object) => {
  apiNotifications.postSubscriptionApi(userSubscription);
};

export const register = async () => {
  if (isPushNotificationSupported()) {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';
      if (isLocalhost) {
        checkValidServiceWorker(swUrl);
      } else {
        registerValidSW(swUrl);
      }
    });
  }
};
export const unregister = () => {
  if ('serviceWorker' in navigator) {
    navigator?.serviceWorker?.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
};

export const askUserPermission = async () => {
  return await Notification.requestPermission();
};
export const checkSubscription = async () => {
  // const existingSubscriptionTest = await mpireServiceWorker.getUserSubscription();
  // console.log(existingSubscriptionTest);

  const isSupportNotification = mpireServiceWorker.isPushNotificationSupported();
  if (isSupportNotification) {
    if (Notification.permission === 'default') {
      mpireServiceWorker.askUserPermission().then((consent) => {
        if (consent === 'granted') {
          mpireServiceWorker.register();
        }
      });
    } else if (Notification.permission === 'granted') {
      mpireServiceWorker.register();
    }

    if (Notification.permission === 'granted') {
      const existingSubscription = await mpireServiceWorker.getUserSubscription();

      if (!existingSubscription) {
        mpireServiceWorker
          .createNotificationSubscription()
          .then((subscrition) => {
            mpireServiceWorker.onSendSubscriptionToPushServer(subscrition);
          })
          .catch((err) => {
            console.log(false);
            console.error(
              "Couldn't create the notification subscription",
              err,
              'name:',
              err.name,
              'message:',
              err.message,
              'code:',
              err.code,
            );
          });
      }
    }
  }
};
export const deleteSubscription = async (auth: string) => {
  return apiNotifications.deleteSubscription(auth);
};
