if (document.getElementById('vue-stepperDemo')) {
    new Vue({
        el: '#vue-stepperDemo',
        data: {
            counter:0,
            skipstep : {
                label : 'Skip steps',
                value: true
            },
            skipsteps:[
                { label: 'Dont skip steps', value: false },
                { label : 'Skip steps', value: true },
            ],
        },
    });
}
