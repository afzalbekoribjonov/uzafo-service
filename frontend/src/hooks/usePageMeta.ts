import { useEffect } from 'react';

const SITE_URL = 'https://uzafo.uz';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

interface PageMeta {
  title: string;
  description: string;
  /** Path used for canonical/og:url, defaults to the current pathname */
  path?: string;
}

/** Keeps the document title, description and canonical/OG URLs in sync per route. */
export function usePageMeta({ title, description, path }: PageMeta) {
  useEffect(() => {
    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);

    const url = SITE_URL + (path ?? window.location.pathname);
    upsertMeta('property', 'og:url', url);
    upsertCanonical(url);
  }, [title, description, path]);
}

/** Non-public surfaces (admin/payments/tenant portals) must not be indexed. */
export function useRobots(noindex: boolean) {
  useEffect(() => {
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
  }, [noindex]);
}
