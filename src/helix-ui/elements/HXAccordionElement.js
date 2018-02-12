import { HXElement } from './HXElement';

export class HXAccordionElement extends HXElement {
    static get is () {
        return 'hx-accordion';
    }

    static get observedAttributes () {
        return [ 'selectedPanel' ];
    }

    constructor () {
        super();
    }

    connectedCallback () {
        var openedPanel = this.getAttribute('selectedPanel');
        this._target = document.querySelector('hx-accordion-panel[id="'+openedPanel+'"]');
        this._target.open=!this._target.open;
    }

    attributeChangedCallback (attr, oldVal, newVal) {
      this._target = document.querySelector('hx-accordion-panel[id="'+oldVal+'"]');
      this._target.open=!this._target.open;
      // this._reveal = this.shadowRoot.querySelector('hx-reveal');
      // this._reveal.setAttribute('aria-expanded', this.open);
      // this._reveal.setAttribute('open', '');
      console.log('Panel -attribute changed');
    }
}
