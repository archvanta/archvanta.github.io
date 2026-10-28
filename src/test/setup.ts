import {configure} from '@testing-library/dom';
import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

// Legacy FRONTIER intro coverage is isolated from unit tests; ARCHVANTA's home opening is permanent.
beforeEach(() => {
  if (typeof window !== 'undefined') window.sessionStorage.setItem('signal-ai:intro-seen:v1', '1');
});

if(typeof HTMLDialogElement!=='undefined'){HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')}}

configure({asyncUtilTimeout:3000});
