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

    dispose() {
        this.model.dispose();
    }

    predict(arr) {
        return tf.tidy(() => {
            const xs = tf.tensor2d([arr]);
            const ys = this.model.predict(xs);
            const outputs = ys.dataSync();
            return outputs;
        });
    }

    createModel() {
        const model = tf.sequential();

        const hidden = tf.layers.dense({
            units: this.hiddenN,
            inputShape: [this.inputN],
            activation: "sigmoid",
        });
        model.add(hidden);

        const output = tf.layers.dense({
            units: this.outputN,
            activation: "sigmoid",
        });
        model.add(output);

        return model;
    }

    copy() {
        return tf.tidy(() => {
            const modelCopy = this.createModel();
            const weights = this.model.getWeights();
            const weightsCopies = [];

            for (let i = 0; i < weights.length; i++) {
                weightsCopies[i] = weights[i].clone();
            }

            modelCopy.setWeights;

            modelCopy.setWeights(weightsCopies);
            return new NeuralNetwork(
                modelCopy,
                this.inputN,
                this.hiddenN,
                this.outputN
            );
        });
    }

    mutate(rate) {
        tf.tidy(() => {
            const weights = this.model.getWeights();
            const mutatedWeights = [];

            for (let i = 0; i < weights.length; i++) {
                let tensor = weights[i];
                let shape = weights[i].shape;
                let values = tensor.dataSync().slice();

                for (let j = 0; j < values.length; j++) {
                    if (Math.random(1) < rate) {
                        let w = values[j];
                        values[j] = w + randn_bm();
                    }
                }

                let newTensor = tf.tensor(values, shape);
                mutatedWeights[i] = newTensor;
            }
            this.model.setWeights(mutatedWeights);
        });
    }
}
