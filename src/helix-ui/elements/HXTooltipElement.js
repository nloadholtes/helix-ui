import debounce from 'lodash/debounce';

import { HXElement } from './HXElement';
import { KEYS } from '../utils';
import { Position, getPositionWithArrow } from '../utils/position';

import shadowMarkup from './HXTooltipElement.html';
import shadowStyles from './HXTooltipElement.less';

const DELAY = 500;
const DEFAULT_POSITION = 'top';

/*
 * ADDED:
 *  - added support for ALL possible positions of a tooltip
 *    (added "-start" and "-end" varieties)
 *
 * BREAKING:
 *  - remove click-to-open behavior
 *  - remove `.triggerEvent` prop and `[trigger-event]` attr
 *  - [role="tooltip"] ALWAYS!
 */

/**
 * Fires when the element's contents are concealed.
 *
 * @event Tooltip:close
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Fires when the element's contents are revealed.
 *
 * @event Tooltip:open
 * @since 0.6.0
 * @type {CustomEvent}
 */

/**
 * Defines behavior for the `<hx-tooltip>` element.
 *
 * @emits Tooltip:close
 * @emits Tooltip:open
 * @extends HXElement
 * @hideconstructor
 * @since 0.2.0
 */
export class HXTooltipElement extends HXElement {
    static get is () {
        return 'hx-tooltip';
    }

    static get template () {
        return `<style>${shadowStyles}</style>${shadowMarkup}`;
    }

    $onCreate () {
        this._onCtrlBlur = this._onCtrlBlur.bind(this);
        this._onCtrlFocus = this._onCtrlFocus.bind(this);
        this._onCtrlMouseLeave = this._onCtrlMouseLeave.bind(this);
        this._onCtrlMouseEnter = this._onCtrlMouseEnter.bind(this);
        this._onDocumentScroll = this._onDocumentScroll.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onWindowResize = debounce(this._reposition, 100);
        this._reposition = this._reposition.bind(this);
        this.id = this.id || `tip-${this.$generateId()}`; // What if id is blank?
    }

    $onConnect () {
        // property upgrades
        this.$upgradeProperty('open');
        this.$upgradeProperty('for');
        this.$upgradeProperty('position');
        this.$upgradeProperty('relativeTo');

        // attribute configuration
        this.$defaultAttribute('position', DEFAULT_POSITION);
        this.setAttribute('aria-hidden', !this.open);
        this.setAttribute('role', 'tooltip');
    }

    $onDisconnect () {
        this._detachListeners();
    }

    static get $observedAttributes () {
        return [
            'for',
            'open',
            'position',
        ];
    }

    $onAttributeChange (attr, oldVal, newVal) {
        switch (attr) {
            case 'for':
                this._attrForChange(oldVal, newVal);
                break;

            case 'open':
                this._attrOpenChange(oldVal, newVal);
                break;

            case 'position':
                this._initialPosition = newVal;
                this._position = newVal;
                break;
        }
    }

    /**
     * External element that controls tooltip visibility.
     *
     * @readonly
     * @returns {HTMLElement|Null}
     */
    get controlElement () {
        if (this._controlElement) {
            return this._controlElement;
        }

        return this.getRootNode().getElementById(this.for);
    }

    /**
     * ID for element that controls appearance of tooltip
     *
     * @type {String}
     */
    get for () {
        return this.getAttribute('for');
    }
    set for (value) {
        this.setAttribute('for', value);
    }

    /**
     * Determines if the tooltip is revealed.
     *
     * @default false
     * @type {Boolean}
     */
    get open () {
        return this.hasAttribute('open');
    }
    set open (value) {
        if (value) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }

    /**
     * Where to position the menu in relation to its reference element.
     *
     * @default "top"
     * @type {PositionString}
     */
    get position () {
        return this.getAttribute('position');
    }
    set position (value) {
        this.setAttribute('position', value);
    }

    /**
     * Reference element used to calculate tooltip position.
     *
     * @readonly
     * @type {HTMLElement}
     */
    get relativeElement () {
        if (this.relativeTo) {
            return this.getRootNode().getElementById(this.relativeTo);
        } else {
            return this.controlElement;
        }
    }

    /**
     * ID of an element to relatively position the tooltip against.
     *
     * @type {String}
     */
    get relativeTo () {
        return this.getAttribute('relative-to');
    }
    set relativeTo (value) {
        this.setAttribute('relative-to', value);
    }

    /** @private */
    get _elRoot () {
        return this.shadowRoot.getElementById('hxTooltip');
    }

    /**
     * Position of the arrow in ShadowDOM
     * @private
     * @returns {String}
     */
    get _position () {
        return this._elRoot.getAttribute('position');
    }
    set _position (value) {
        this._elRoot.setAttribute('position', value);
    }

    /** @private */
    _attachListeners () {
        if (this._controlElement) {
            this._enableFocusEvents(this._controlElement);
            this._enableMouseEvents(this._controlElement);

            //this._controlElement.addEventListener('focus', this._onCtrlFocus);
            //this._controlElement.addEventListener('mouseenter', this._onCtrlMouseEnter);
        }
    }

    /** @private */
    _attrForChange () {
        // detach listeners from old control element
        this._detachListeners();

        // re-memoize control element
        delete this._controlElement;
        this._controlElement = this.controlElement;

        this._makeControlAccessible();

        // attach listeners to new control element
        this._attachListeners();
    }

    /** @private */
    _attrOpenChange (oldVal, newVal) {
        let isOpen = (newVal !== null);
        this.setAttribute('aria-hidden', !isOpen);
        this.$emit(isOpen ? 'open' : 'close');

        if (isOpen) {
            document.addEventListener('scroll', this._onDocumentScroll);
            window.addEventListener('resize', this._onWindowResize);
            this._reposition();
        } else {
            document.removeEventListener('scroll', this._onDocumentScroll);
            window.removeEventListener('resize', this._onWindowResize);
        }
    }

    /**
     * Returns true if a control element is present and active/focused.
     * @private
     * @returns {Boolean}
     */
    get _ctrlHasFocus () {
        if (!this._controlElement) {
            console.log('control is NOT focused');
            return false;
        }

        let res = (this.getRootNode().activeElement === this._controlElement);
        console.log(`control ${res ? 'is' : 'is NOT'} focused`);
        return res;
    }

    /** @private */
    _detachListeners () {
        if (this._controlElement) {
            this._controlElement.removeEventListener('blur', this._onCtrlBlur);
            this._controlElement.removeEventListener('focus', this._onCtrlFocus);
            this._controlElement.removeEventListener('keyup', this._onKeyUp);
            this._controlElement.removeEventListener('mouseenter', this._onCtrlMouseEnter);
            this._controlElement.removeEventListener('mouseleave', this._onCtrlMouseLeave);
        }
    }

    /** @private */
    _disableFocusEvents (target) {
        console.log('disable focus events');
        target.removeEventListener('blur', this._onCtrlBlur);
        target.removeEventListener('focus', this._onCtrlFocus);
    }

    /** @private */
    _disableMouseEvents (target) {
        console.log('disable mouse events');
        target.removeEventListener('mouseenter', this._onCtrlMouseEnter);
        target.removeEventListener('mouseleave', this._onCtrlMouseLeave);
    }

    /** @private */
    _enableFocusEvents (target) {
        console.log('enable focus events');
        target.addEventListener('focus', this._onCtrlFocus);
    }

    /** @private */
    _enableMouseEvents (target) {
        console.log('enable mouse events');
        target.addEventListener('mouseenter', this._onCtrlMouseEnter);
    }

    /** @private */
    _hide () {
        console.log('_hide');
        // cancel SHOW
        clearTimeout(this._showTimeout);

        if (this.open && !this._ctrlHasFocus) {
            // clear old timeout (if it exists)
            clearTimeout(this._hideTimeout);

            // schedule HIDE
            this._hideTimeout = setTimeout(() => {
                this.open = false;
            }, DELAY);
        }
    }

    /** @private */
    _makeControlAccessible () {
        if (this._controlElement) {
            this._controlElement.setAttribute('aria-describedby', this.id);

            if (this._controlElement.tabIndex !== 0) {
                this._controlElement.tabIndex = 0;
            }
        }
    }

    /** @private */
    _onCtrlBlur (event) {
        console.log('_onCtrlBlur');
        event.target.removeEventListener('blur', this._onCtrlBlur);
        event.target.addEventListener('focus', this._onCtrlFocus);
        this._hide();
        this._enableMouseEvents(event.target);
    }

    /** @private */
    _onCtrlFocus (event) {
        console.log('_onCtrlFocus');
        event.target.removeEventListener('focus', this._onCtrlFocus);
        event.target.addEventListener('blur', this._onCtrlBlur);
        document.addEventListener('keyup', this._onKeyUp);
        this._disableMouseEvents(event.target);
        this._show();
    }

    /** @private */
    _onCtrlMouseEnter (event) {
        console.log('_onCtrlMouseEnter', event);
        if (!this._ctrlHasFocus) {
            event.target.removeEventListener('mouseenter', this._onCtrlMouseEnter);
            event.target.addEventListener('mouseleave', this._onCtrlMouseLeave);
            this._disableFocusEvents(event.target);
            this._show();
        }
    }

    /** @private */
    _onCtrlMouseLeave (event) {
        console.log('_onCtrlMouseLeave');
        event.target.removeEventListener('mouseleave', this._onCtrlMouseLeave);
        event.target.addEventListener('mouseenter', this._onCtrlMouseEnter);
        this._hide();
        this._enableFocusEvents(event.target);
    }

    /** @private */
    _onDocumentScroll () {
        this._reposition();
    }

    /** @private */
    _onKeyUp (event) {
        console.log('_onKeyUp');
        if (event.keyCode === KEYS.Escape) {
            this._enableFocusEvents(this._controlElement);
            this.open = false;
            // remove itself on success
            document.removeEventListener('keyup', this._onKeyUp);
        }
    }

    /** @private */
    _reposition () {
        if (this.relativeElement) {
            let data = getPositionWithArrow({
                element: this,
                reference: this.relativeElement,
                position: this.position,
            });

            this.style.top = `${data.y}px`;
            this.style.left = `${data.x}px`;
            this._position = data.position;
        }
    }

    /** @private */
    _show () {
        console.log('_show');
        // cancel HIDE
        clearTimeout(this._hideTimeout);

        if (!this.open) {
            // clear old timeout (if it exists)
            clearTimeout(this._showTimeout);

            // schedule SHOW
            this._showTimeout = setTimeout(() => {
                this.open = true;
            }, DELAY);
        }
    }
}
