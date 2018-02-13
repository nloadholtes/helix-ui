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
        this._toggleStep = this._toggleStep.bind(this);
    }

    connectedCallback () {
        this._openedPanelId = this.getAttribute('selectedPanel');
        if (this._openedPanelId) {
          this._target = document.querySelector('hx-accordion-panel[id="'+this._openedPanelId+'"]');
          this._target.open=!this._target.open;
          document.querySelector('hx-accordion').addEventListener('click', this._toggleStep)
        }
    }

    attributeChangedCallback (attr, oldVal, newVal) {
      this._target = document.querySelector('hx-accordion-panel[id="'+oldVal+'"]');
      this._target.open=!this._target.open;
      console.log('Panel -attribute changed');
    }

    _toggleStep() {
      this._newPanelId = this.getAttribute('selectedPanel');
      if (this._openedPanelId !== this._newPanelId) {
        this._oldTarget = document.querySelector('hx-accordion-panel[id="'+this._openedPanelId+'"]');
        this._oldReveal = this._oldTarget.shadowRoot.querySelector('hx-reveal');
        this._oldDisclosure = this._oldTarget.shadowRoot.querySelector('hx-disclosure');
        //Close the old Panel
        this._oldTarget.open=false;
        this._oldReveal.setAttribute('aria-expanded', false);
        this._oldDisclosure.setAttribute('aria-expanded', false);
        this._oldReveal.removeAttribute('open');
        //reset the panelId variable
        this._openedPanelId = this._newPanelId;
      }

    }
}
