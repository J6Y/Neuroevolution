class NeuralNetwork {
    constructor(a, b, c) {
        this.inputN = a;
        this.hiddenN = b;
        this.outputN = c;
        this.model = this.createModel();
    }

    predict(arr) {
        const xs = tf.tensor2d([arr]);
        const ys = this.model.predict(xs);
        const outputs = ys.dataSync();
        return outputs;
    }

    createModel() {

        const model = tf.sequential();
        
        const hidden = tf.layers.dense({
            units: this.hiddenN,
            inputShape: [this.inputN],
            activation: 'sigmoid'
        });
        model.add(hidden);

        const output = tf.layers.dense({
            units: this.outputN,
            activation: 'sigmoid'
        })
        model.add(output);
        
        return model;
        
        //this.model.compile({});
    }
}