import { HXElement } from './HXElement';
import shadowStyles from './_hx-accordion-panel.less';

const tagName = 'hx-accordion-panel';
const template = document.createElement('template');
template.innerHTML = `
  
  <hx-disclosure class="hxBtn" aria-controls="hx-accordian-body">
    <slot name="header"></slot>
  </hx-disclosure>
  <hx-reveal id="hx-accordian-body">
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
