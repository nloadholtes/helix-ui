import { HXElement } from './HXElement';
import { KEYS } from '../util';
import shadowStyles from './_hx-accordion-panel.less';

const tagName = 'hx-accordion-panel';
const template = document.createElement('template');
template.innerHTML = `
  <style>${shadowStyles}</style>
  <hx-disclosure id="hx-accordion-header" aria-controls="hx-accordion-body">
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

    static get observedAttributes () {
        return [ 'current' ];
    }

    constructor () {
        super(tagName, template);
        this._onStepClick = this._onStepClick.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this.touched = false;
    }

    connectedCallback () {
        this.$upgradeProperty('current');
        this._target = this.shadowRoot.querySelector('hx-disclosure');
        this._reveal = this.shadowRoot.querySelector('hx-reveal');
        this._index = this.parentElement.steps.indexOf(this);
        if (!this._target) {
            return;
        }
        if (this.parentElement.getAttribute('skipstep') === 'false'
            && this.parentElement.getAttribute('current-step') < this._index) {
            this._target.setAttribute('disabled', true);
            this._isStepNavEnabled = false;
        } else {
            this._target.addEventListener('click', this._onStepClick);
            this._target.addEventListener('keyup', this._onKeyUp);  
            this._target.removeAttribute('disabled'); 
        }
    }

    disconnectedCallback () {
        if (!this._target) {
            return;
        }
        this._target.removeEventListener('click', this._onStepClick);
    }

    attributeChangedCallback (attr, oldVal, newVal) {
        this.setAttribute('aria-selected', newVal !== null);
        if (!this.parentElement._allowMultiStep) {
            this._reveal = this.shadowRoot.querySelector('hx-reveal');
            this._reveal.setAttribute('aria-expanded', this.open);
            this._reveal.setAttribute('open', '');
        }
        if (newVal && this._target && this._reveal) {
            this._target.addEventListener('click', this._onStepClick);
            this._target.addEventListener('keyup', this._onKeyUp);  
            this._target.removeAttribute('disabled');
        } 
        // did not work
        // this._target = this.shadowRoot.querySelector('hx-disclosure');
        // this._target.expanded=true;
    }

    _onStepClick () {
        let accordianElement = this.parentElement;
        let selectedIndex = (isNaN(accordianElement.steps.indexOf(this)) ? 0
            : accordianElement.steps.indexOf(this));
        accordianElement.currentTab = selectedIndex;
        accordianElement.setAttribute('current-step',selectedIndex);
        if (this.parentElement._allowMultiStep && this.touched
            && Number(this.parentElement.getAttribute('current-step')) === this._index) {
            this._reveal.setAttribute('aria-expanded', this.open);
            this.open && this._reveal.removeAttribute('open');
            this.touched = false;
        } else {
            this._reveal.setAttribute('aria-expanded', this.open);
            this._reveal.setAttribute('open', '');
            this.touched = true;
        }
    }

    _disableStep () {
        if (this.parentElement.getAttribute('skipstep') === 'false'
            && this.parentElement.getAttribute('current-step') !== this.index
            && this._target && this._reveal) {
            this._target.setAttribute('disabled', true);
            this._reveal.setAttribute('disabled', true);
            this._isStepNavEnabled = false;
        }
    }

    get current () {
        return this.hasAttribute('current');
    }

    set current (newVal) {
        if (newVal) {
            this.setAttribute('current', true);
        } else {
            this.removeAttribute('current');
        }
    }

    _onKeyUp (evt) {
        evt.keyCode === KEYS.Enter && this._onStepClick();
    }

}
