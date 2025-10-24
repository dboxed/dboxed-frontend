'use client';

import { useEffect } from "react";
import { envVars } from "@/env.ts";

export function MatomoAnalytics() {
  useEffect(() => {
    if (!envVars.VITE_MATOMO_TAG_MANAGER) {
      return
    }
    const w = window as any
    const _mtm = w._mtm = w._mtm || [];
    _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
    (function() {
      const d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0] as any;
      g.async=true; g.src=envVars.VITE_MATOMO_TAG_MANAGER; s.parentNode.insertBefore(g,s);
    })();
  }, []);

  return null
}

export function setMatomoConsent(cookie: boolean) {
  if (!envVars.VITE_MATOMO_TAG_MANAGER) {
    return
  }

  const w = window as any
  if (cookie) {
    w._paq=w._paq||[];w._paq.push(['rememberCookieConsentGiven']);
  } else {
    w._paq=w._paq||[];w._paq.push(['forgetCookieConsentGiven']);
  }
}
