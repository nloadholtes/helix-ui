import { HXElement } from './HXElement';
import { KEYS } from '../util';

export class HXAccordionElement extends HXElement {
    static get is () {
        return 'hx-accordion';
    }

    static get observedAttributes () {
        return [ 'current-step' ];
    }

    constructor () {
        super();
        this._stepHeaders = this.stepHeaders;
        this._onKeyUp = this._onKeyUp.bind(this);
    }

    connectedCallback () {
        this.$upgradeProperty('current-step');
        this._allowMultiStep = !this.hasAttribute('current-step');
        this._skipStep = this.getAttribute('skipstep');
        this._setupIds();
        this.defaultStep = Number(this.getAttribute('current-step'));
        this.currentStep = this._allowMultiStep ? -1 : this.defaultStep || 0;
        
        this.stepHeaders.forEach((header) => {
            header.addEventListener('click', this._onStepClick);
            header.addEventListener('keydown', this._onKeyUp);
        });
    }

    disconnectedCallback () {
        this.stepHeaders.forEach((header) => {
            header.removeEventListener('click', this._onStepClick);
            header.removeEventListener('keydown', this._onKeyUp);
        });
    }

    get currentStep () {
        return this._currentStep || -1;
    }

    set currentStep (idx) {
        if (isNaN(idx)) {
            throw new TypeError(`'currentStep' expects an numeric index. Got ${typeof idx} instead.`);
        }

        if (this._currentStep !== idx) {
            this._currentStep = idx;
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
        }
        
    }//SET:currentStep

    get steps () {
        return Array.from(this.querySelectorAll('hx-accordion-panel'));
    }

    get stepHeaders () {
        let stepHeaders = [];
        this.steps.forEach(step => {
            stepHeaders.push(step.querySelector('header'));
        });
        return stepHeaders;
    }

    attributeChangedCallback (attr, oldValue, newVal) {
        if (!isNaN(newVal)) {
            this.currentStep = Number(newVal);
        }
        if (newVal && !isNaN(newVal) && oldValue !== newVal) {
            if (this.steps[newVal].shadowRoot) {
                this.steps[newVal].shadowRoot.querySelector('hx-reveal').setAttribute('open', '');
                this.steps[newVal].shadowRoot.querySelector('hx-disclosure').setAttribute('aria-expanded', true);
                this.steps[newVal].shadowRoot.querySelector('hx-icon').setAttribute('type',  'angle-up');
            }
        } 

        if (!this._allowMultiStep && oldValue && !isNaN(oldValue) && !isNaN(newVal)) {
            const reveal = this.steps[oldValue].shadowRoot.querySelector('hx-reveal');
            if (reveal.hasAttribute('open')) {
                reveal.removeAttribute('open');
                this.steps[oldValue].shadowRoot.querySelector('hx-disclosure').setAttribute('aria-expanded', false);
                this.steps[oldValue].shadowRoot.querySelector('hx-icon').setAttribute('type', 'angle-down');
            } else {
                reveal.setAttribute('open', '');
                this.steps[oldValue].shadowRoot.querySelector('hx-disclosure').setAttribute('aria-expanded', true);
                this.steps[oldValue].shadowRoot.querySelector('hx-icon').setAttribute('type',  'angle-up');
            }
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

    _onStepClick (evt) {
        const panel = this.parentElement;
        const accordionElement = panel.parentElement;
        let revealElement = this.parentElement.shadowRoot.querySelector('hx-reveal');

        if (!panel.getAttribute('disabled')) {
            if (!accordionElement._allowMultiStep) {
                accordionElement.setAttribute('current-step', accordionElement.stepHeaders.indexOf(evt.currentTarget));
            } else {
                const hxIcon = panel.shadowRoot.querySelector('hx-icon');
                if (accordionElement.hasAttribute('current-step') && revealElement.open === true) {
                    let disclosureElement = this.parentElement.shadowRoot.querySelector('hx-disclosure');
                    revealElement.removeAttribute('open');
                    disclosureElement.setAttribute('aria-expanded', false);
                    hxIcon.setAttribute('type', 'angle-down');
    
                } else {
                    accordionElement.setAttribute('current-step', 
                        accordionElement.stepHeaders.indexOf(evt.currentTarget));
                    hxIcon.setAttribute('type', 'angle-up');
                }
            }
        }
    }

    _onKeyUp (evt) {
        evt.keyCode === KEYS.Enter && this._onStepClick();
    }

}
