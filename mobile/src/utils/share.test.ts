import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildListingShareMessage, buildListingShareUrl, WEB_BASE_URL } from './share.ts';

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
