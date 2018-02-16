if (document.getElementById('vue-stepperDemo')) {
    new Vue({
        el: '#vue-stepperDemo',
        data: {
            step : 0,
            step2 : 0,
            example2StepArr: [],
            skipstep : {
                label : 'Skip steps',
                value: true,
            },
            skipsteps: [
              { label: 'Dont skip steps', value: false },
              { label : 'Skip steps', value: true },
            ],
        },
        methods: {
          nextStep: function(event) {
            this.step = Number(event.target.parentElement.parentElement.getAttribute('current-step')) || 0;
            //-1> this.step <2 ? this.step +=1: this.step = 0;
            this.step +=1
          },
          previousStep: function() {
            this.step = Number(event.target.parentElement.parentElement.getAttribute('current-step'));
            this.step > 0 ? this.step -=1: 0
          },
          nextStep2: function(event) {
            this.example2StepArr = Array.from(event.target.parentElement.parentElement.getElementsByTagName('hx-accordion-panel'));
            let currentStep = Number(event.target.parentElement.parentElement.getAttribute('current-step'));
            if (!currentStep) {
              currentStep = this.example2StepArr.indexOf(event.target.parentElement);
            }
            this.step2 =  currentStep;
            -1> this.step2 <2 ? this.step2 +=1: this.step2 = 0;
            event.target.parentElement.parentElement.setAttribute('current-step', this.step2);
          },
          previousStep2: function(event) {
            this.example2StepArr = Array.from(event.target.parentElement.parentElement.getElementsByTagName('hx-accordion-panel'));
            let currentStep = Number(event.target.parentElement.parentElement.getAttribute('current-step'));
            if (!currentStep) {
              currentStep = this.example2StepArr.indexOf(event.target.parentElement);
            }
            this.step2 =  currentStep;
            this.step2 > 0 ? this.step2 -=1: 0
            event.target.parentElement.parentElement.setAttribute('current-step', this.step2);
          },
        },
    });
}
