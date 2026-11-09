import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  buildListingShareMessage,
  buildListingShareUrl,
  shareListingLink,
  buildListingDeepLinkTarget,
  WEB_BASE_URL,
} from './share.ts';

describe('buildListingShareUrl', () => {
  it('points at the web listing route', () => {
    assert.equal(buildListingShareUrl('abc123'), 'https://ruoffcampus.vercel.app/listings/abc123');
  });

  it('accepts numeric ids', () => {
    assert.equal(buildListingShareUrl(42), `${WEB_BASE_URL}/listings/42`);
  });

  it('encodes reserved characters in ids', () => {
    assert.equal(buildListingShareUrl('a/b?c'), `${WEB_BASE_URL}/listings/a%2Fb%3Fc`);
  });
});

describe('buildListingShareMessage', () => {
  it('includes the title and share URL', () => {
    const message = buildListingShareMessage({ id: '7', title: 'Sunny 2BR near College Ave' });
    assert.ok(message.startsWith('Sunny 2BR near College Ave'));
    assert.ok(message.endsWith('https://ruoffcampus.vercel.app/listings/7'));
  });
});

describe('shareListingLink', () => {
  it('passes the title and link to the native share sheet', async () => {
    const calls: { message: string }[] = [];
    const result = await shareListingLink({ id: '7', title: 'Sunny 2BR' }, async (content) => {
      calls.push(content);
    });
    assert.deepEqual(result, { shared: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].message, 'Sunny 2BR - https://ruoffcampus.vercel.app/listings/7');
  });

  it('returns the fallback URL when native share fails', async () => {
    const result = await shareListingLink({ id: '9', title: 'Loft' }, async () => {
      throw new Error('share sheet unavailable');
    });
    assert.deepEqual(result, { shared: false, fallbackUrl: 'https://ruoffcampus.vercel.app/listings/9' });
  });
});

describe('buildListingDeepLinkTarget', () => {
  it('maps share-link ids onto the native detail route', () => {
    assert.deepEqual(buildListingDeepLinkTarget('mock-1'), {
      pathname: '/listing/[id]',
      params: { id: 'mock-1' },
    });
  });

  it('stringifies numeric ids', () => {
    assert.deepEqual(buildListingDeepLinkTarget(42).params, { id: '42' });
  });
});
