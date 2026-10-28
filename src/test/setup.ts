import {configure} from '@testing-library/dom';
import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

// The opening animation plays once per session; unit tests render the app as a returning visitor.
beforeEach(() => {
  if (typeof window !== 'undefined') {window.sessionStorage.setItem('signal-ai:intro-seen:v1', '1');window.sessionStorage.setItem('archvanta:entrance-seen:v1','1');}
});

if(typeof HTMLDialogElement!=='undefined'){HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')}}

configure({asyncUtilTimeout:3000});
