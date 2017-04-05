/*
Copyright (c) 2017 - AfroTech - https://github.com/afrotechnology/kemet-flipcard

Permission is hereby granted, free of charge, to any person 
obtaining a copy of this software and associated documentation 
files (the "Software"), to deal in the Software without restriction,
 including without limitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell copies of 
the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall 
be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.
*/

class FlipCard extends Polymer.Element {
    static get is() { return 'kemet-flipcard'; }

    static get properties() {
        return {
            duration: {
                type: Number,
                value: 800
            },
            axis: {
                type: String,
                value: 'Y' 
            },
            locked: {
                type: Boolean,
                value: false
            }
        };
    }

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();

        this._currentside = 'front';
        this._front = this.shadowRoot.querySelector('.front');
        this._back = this.shadowRoot.querySelector('.back');

        this._front.inert = false;
        this._back.inert = true;

        if (this.axis.toUpperCase() === 'RANDOM') {
            this.axis = (Math.random() > 0.5 ? 'Y' : 'X');
        }
    }

    ready() {
        super.ready();

        var host = this;

        host.addEventListener('click', event => {
            if (event.target.hasAttribute('toggle')) {
            this.flip(event);
            }
        });

        setTimeout(function() {
            host._setHeight(host);
        }, 1);

        window.addEventListener('resize', function(event) {
            host._setHeight(host);
        });
        }

    flip() {
        if (this.locked) return;

        this.locked = true;

        const scale = (500 + 200) / 500;

        const sideOne = [
            {transform: `translateZ(-200px) rotate${this.axis}(0deg) scale(${scale})`},
            {transform: `translateZ(-100px) rotate${this.axis}(0deg) scale(${scale})`, offset: 0.15},
            {transform: `translateZ(-100px) rotate${this.axis}(180deg) scale(${scale})`, offset: 0.65},
            {transform: `translateZ(-200px) rotate${this.axis}(180deg) scale(${scale})`}
        ];

        const sideTwo = [
            {transform: `translateZ(-200px) rotate${this.axis}(180deg) scale(${scale})`},
            {transform: `translateZ(-100px) rotate${this.axis}(180deg) scale(${scale})`, offset: 0.15},
            {transform: `translateZ(-100px) rotate${this.axis}(360deg) scale(${scale})`, offset: 0.65},
            {transform: `translateZ(-200px) rotate${this.axis}(360deg) scale(${scale})`}
        ];

        const timing = {
            duration: this.duration,
            iterations: 1,
            easing: 'ease-in-out',
            fill: 'forwards'
        };

        switch (this._currentside) {
            case 'front' :
            this._front.animate(sideOne, timing);
            this._back.animate(sideTwo, timing).onfinish = this._toggleSide(this);

            this._back.focus();
            this._front.inert = true;
            this._back.inert = false;
            break;

            case 'back' :
            this._front.animate(sideTwo, timing);
            this._back.animate(sideOne, timing).onfinish = this._toggleSide(this);

            this._front.focus();
            this._front.inert = false;
            this._back.inert = true;
            break;

            default:
            throw new Error('Unknown side');
        }
    }

    _setHeight(hostElement) {
        var front = hostElement.querySelector('[slot="front"'),
            back = hostElement.querySelector('[slot="back"'),
            padtop = window.getComputedStyle(hostElement.shadowRoot.querySelector('.front')).getPropertyValue('padding-top'),
            padbottom = window.getComputedStyle(hostElement.shadowRoot.querySelector('.front')).getPropertyValue('padding-bottom');

        front.querySelector(':first-child').style.marginTop = 0;
        back.querySelector(':first-child').style.marginTop = 0;
        front.querySelector(':last-child').style.marginBottom = 0;
        back.querySelector(':last-child').style.marginBottom = 0;

        if (front.offsetHeight > back.offsetHeight) {
            var baseheight = front.offsetHeight + 'px';
        } else {
            var baseheight = back.offsetHeight + 'px';
        }

        hostElement.style.height = hostElement._combinePixels([padtop, padbottom, baseheight]);
    }

    _combinePixels(values) {
        var sum = 0;

        for (var i=0; i < values.length; i++) {
            sum += Number(values[i].replace('px', ''));
        }

        return sum + "px";
    }

    _toggleSide(hostElement) {
        hostElement.locked = false;
        hostElement._currentside = (hostElement._currentside == 'front') ? 'back' : 'front'; 
    }

}

window.customElements.define(FlipCard.is, FlipCard);