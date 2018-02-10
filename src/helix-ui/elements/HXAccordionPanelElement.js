import { HXElement } from './HXElement';
import debounce from 'lodash/debounce';
import shadowStyles from './_hx-accordion-panel.less';

const tagName = 'hx-accordion-panel';
const template = document.createElement('template');
template.innerHTML = `
  <style>${shadowStyles}</style>
  <hx-disclosure class="hxBtn" aria-controls="hx-accordion-body">
    <slot name="header"></slot>
  </hx-disclosure>
  <hx-reveal id="hx-accordion-body">
    <slot></slot>
  </hx-reveal>
`;

export class HXAccordionPanelElement extends HXElement {
    static get is () {
        return tagName;
    }



    constructor () {
        super(tagName, template);
        //this._toggle = this._toggle.bind(this);
        //this._onKeyUp = this._onKeyUp.bind(this);
        //this._onTabClick = this._onTabClick.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('open');
      //  this._initialPosition = this.position;
    }

    // _toggle () {
    //     this.open = !this.open;
    // }
}
