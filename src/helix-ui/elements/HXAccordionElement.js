import { HXElement } from './HXElement';

export class HXAccordionElement extends HXElement {
    static get is () {
        return 'hx-accordion';
    }

    static get observedAttributes () {
        return [ 'selected' ];
    }

    constructor () {
        super();
        this.$panellist = this.querySelector('hx-accordion-panel');
        console.log("debug .... "+ this.$panellist);
        //this._onKeyUp = this._onKeyUp.bind(this);
        //this._onTabClick = this._onTabClick.bind(this);
    }
}
