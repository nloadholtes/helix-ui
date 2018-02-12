import { HXElement } from './HXElement';
import debounce from 'lodash/debounce';
import shadowStyles from './_hx-accordion-panel.less';

const tagName = 'hx-accordion-panel';
const template = document.createElement('template');
template.innerHTML = `
  <style>${shadowStyles}</style>
  <hx-disclosure class="hxContainerTitle" aria-controls="hx-accordion-body">
    <slot name="header"></slot>
  </hx-disclosure>
  <hx-reveal id="hx-accordion-body">
    <slot></slot>
  </hx-reveal>
  </br>
`;

export class HXAccordionPanelElement extends HXElement {
    static get is () {
        return tagName;
    }

    static get observedAttributes () {
        return [ 'open' ];
    }

    constructor () {
        super(tagName, template);
        this._toggle = this._toggle.bind(this);

    }
    connectedCallback () {
        this.$upgradeProperty('open');
        this._target = this.shadowRoot.querySelector('hx-disclosure');
        if (!this._target) {
             return;
        }

        this._target.addEventListener('click', this._toggle);
    }

    attributeChangedCallback (attr, oldVal, newVal) {
      this._reveal = this.shadowRoot.querySelector('hx-reveal');
      this._reveal.setAttribute('aria-expanded', this.open);
      this._reveal.setAttribute('open', '');
    }

    disconnectedCallback () {
        if (!this._target) {
            return;
        }
        this._target.removeEventListener('click', this._toggle);
    }

    _toggle () {
        this.open = !this.open;
    }

    set open (value) {
        if (value) {
            this.setAttribute('open', '');
            this.parentElement.setAttribute('selectedPanel', this.id);
        } else {
            this.removeAttribute('open');
        }
    }

    get open () {
        return this.hasAttribute('open');
    }

}
