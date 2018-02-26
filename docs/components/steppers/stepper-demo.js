if (document.getElementById('vue-stepperDemo')) {
    new Vue({
        el: '#vue-stepperDemo',
        data: {
            step : 1,
            step2 : 0,
            stepValue: '',
            skipstep : {
                label : 'Skip steps',
                value: true,
            },
            skipsteps: [ { label: 'Dont skip steps', value: false }, { label : 'Skip steps', value: true } ],
        },
        methods: {
            nextStep: function (event) {
                this.step = Number (event.target.parentElement.parentElement.getAttribute('current-step')) || 0;
                (-1 < this.step && this.step < 2) ? this.step += 1 : this.step = 0;
                //event.target.parentElement.parentElement.setAttribute('current-step', this.step);
            },
            previousStep: function () {
                this.step = Number (event.target.parentElement.parentElement.getAttribute('current-step'));
                this.step = this.step > 0 ? this.step -= 1 : 0;
            },
            nextStep2: function (event) {
                this.example2StepArr =
                  Array.from(event.target.parentElement.parentElement.getElementsByTagName('hx-accordion-panel'));
                let currentStep = this.example2StepArr.indexOf(event.target.parentElement);
                this.step2 = (-1 < currentStep && currentStep < 2) ? currentStep + 1 :
                    this.example2StepArr.indexOf(event.target.parentElement) + 1 ;
                event.target.parentElement.parentElement.setAttribute('current-step', this.step2);
            },
            previousStep2: function (event) {
                this.example2StepArr =
                  Array.from(event.target.parentElement.parentElement.getElementsByTagName('hx-accordion-panel'));
                let currentStep = this.example2StepArr.indexOf(event.target.parentElement);
                this.step2 = currentStep > 0 ? currentStep - 1 : 0;
                event.target.parentElement.parentElement.setAttribute('current-step', this.step2);
            },
            nextStepBindStepValue: function (event) {
                const accordion = event.target.parentElement;
                accordion.setAttribute('stepValue', this.stepValue);
                accordion.setAttribute('complete','');
                this.nextStep(event);
            },
        },
    });
}
