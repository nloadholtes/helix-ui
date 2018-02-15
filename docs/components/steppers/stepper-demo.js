if (document.getElementById('vue-stepperDemo')) {
    new Vue({
        el: '#vue-stepperDemo',
        data: {
            step:0,
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
          nextStep: (()=> {
            console.log(this.step);
              -1>this.step+1>3 ? this.step +=1: this.step = 0;
          }),
          previousStep: (()=> this.step-1 > -1? this.step -=1: 0)
        }
    });
}
