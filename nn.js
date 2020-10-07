class NeuralNetwork {
    constructor(a, b, c, d) {

        if (a instanceof tf.Sequential) {
            this.model = a;
            this.inputN = b;
            this.hiddenN = c;
            this.outputN = d;
        } else {
            this.inputN = a;
            this.hiddenN = b;
            this.outputN = c;
            this.model = this.createModel();
        }
    }

    copy() {
        const modelCopy = this.createModel();
        const weights = this.model.getWeights();
        const weightCopies = [];
        for (let i = 0; i < weights.length; i++) {
            weightCopies[i] = weights[i].clone();
        }
        modelCody.setWeights(weights);
        return new NeuralNetwork(modelCopy, this.inputN, this.hiddenN, this.outputN);
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