import { HXElement } from './HXElement';

export class HXAccordionElement extends HXElement {
    static get is () {
        return 'hx-accordion';
    }

    static get observedAttributes () {
        return [ 'current-step' ];
    }

    constructor () {
        super();
    }

    connectedCallback () {
        this.$upgradeProperty('current-step');
        this._allowMultiStep = !this.hasAttribute('current-step');
        this._setupIds();
        if (this.hasAttribute('current-step')) {
            this.currentTab = Number(this.getAttribute('current-step')) || 0;
        }

    }

    get currentTab () {
        return this._currentTab || -1;
    }

    set currentTab (idx) {
        if (isNaN(idx)) {
            throw new TypeError(`'currentTab' expects an numeric index. Got ${typeof idx} instead.`);
        }

        this._currentTab = idx;

        this.steps.forEach((item, stepIdx) => {
            if (idx === stepIdx) {
                item.current = true;
                item.setAttribute('stepindex', 0);
            } else {
                item.current = false;
                item.setAttribute('stepindex', -1);
                item.blur();
            }
        });

        this.steps.forEach((step, panelIdx) => {
            step.open = (idx === panelIdx);
        });
    }//SET:currentTab

    get steps () {
        return Array.from(this.querySelectorAll('hx-accordion-panel'));
    }

    attributeChangedCallback (attr, oldValue, newVal) {
        if (!isNaN(newVal)) {
            this.currentTab = Number(newVal);
        }
        if (!this._allowMultiStep && oldValue && !isNaN(oldValue)) {
            this.steps[oldValue].shadowRoot.querySelector('hx-reveal').removeAttribute('open');
            this.steps[oldValue].shadowRoot.querySelector('hx-disclosure').setAttribute('aria-expanded', false);
        }
    }

    _setupIds () {
        this.steps.forEach((item, idx) => {
            let stepId = `hx-accordion-panel-${this.$generateId()}-${idx}`;

            if (item.hasAttribute('id')) {
                stepId = item.getAttribute('id');
            } else {
                item.setAttribute('id', stepId);
            }

            item.setAttribute('aria-controls',stepId);
        });
    }//_setupIds
}
