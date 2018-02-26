import { HXElement } from './HXElement';
import shadowStyles from './_hx-accordion-panel.less';

const tagName = 'hx-accordion-panel';
const template = document.createElement('template');
template.innerHTML = `
  <style>${shadowStyles}</style>
  <hx-disclosure id="hx-accordion-header" aria-controls="hx-accordion-body">
    <slot name="header"></slot>
    <span class="hxStepSelection"></span>
    <hx-icon class="hxStepArrow" type="angle-down"></hx-icon>
  </hx-disclosure>
  <hx-reveal id="hx-accordion-body">
    <slot></slot>
  </hx-reveal>
`;

export class HXAccordionPanelElement extends HXElement {
    static get is () {
        return tagName;
    }

    static get observedAttributes () {
        return [ 'current' , 'stepvalue' ];
    }

    constructor () {
        super(tagName, template);
        this.touched = false;
        this._stepName = this.shadowRoot.querySelector('hx-disclosure > span');
    }

    connectedCallback () {
        this.$upgradeProperty('current');
        this.$defaultAttribute('role', 'tab');
        this.setAttribute('aria-selected', this.current);
        this._stepName.innerText = this.getAttribute('stepvalue');
        this._index = this.parentElement.steps.indexOf(this);

        // logic to expand and show current-step by default
        if (Number(this.getAttribute('stepindex')) > -1) {
            this.setAttribute('current', true);
            this.shadowRoot.querySelector('hx-reveal').setAttribute('open', '');
            this.shadowRoot.querySelector('hx-icon').setAttribute('type',  'angle-up');
        }

        if (this.parentElement.getAttribute('skipstep') === 'false'
        && this.parentElement.getAttribute('current-step') < this._index) {
            this.setAttribute('disabled', true);
        }
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        switch (attr) {
            case 'current' :
                this.setAttribute('aria-selected', newVal !== null);
                if (newVal !== null) {
                    this.removeAttribute('disabled');
                }
                break;
            case 'stepvalue' :
                this._stepName.innerText = this.getAttribute('stepvalue');
                break;
        }
    }
        
    get current () {
        return this.hasAttribute('current');
    }

    set current (newVal) {
        newVal ? this.setAttribute('current', true) : this.removeAttribute('current');
    }
}
