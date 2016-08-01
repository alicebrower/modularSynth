createOsc = function(name, audioCtx) {
    var result = {
        name: name,
        osc: audioCtx.createOscillator(),
        gain: audioCtx.createGain(),
        destination: null,
        toggleFreqOsc: function(on) {
            var osc = (this.freqOsc.source == null) ? this.freqOsc.default : this.freqOsc.source;

            this.freqOsc.on = on;
            if(on) {
                osc.connect(this.osc.frequency);
            } else {
                osc.disconnect(this.osc.frequency);
            }
        },
        toggleGainOsc: function(on) {
            var osc = (this.gainOsc.source == null) ? this.gainOsc.default : this.gainOsc.source;

            this.gainOsc.on = false;
            if(on) {
                osc.connect(this.gain.gain);
            } else {
                osc.disconnect(this.gain.gain);
            }
        },
        getInputs: function() {
            return [
                this.freqOsc, this.gainOsc
            ];
        }
    };

    result.routeTo = function() {
        console.log("routing");

        if(this.destination) {
            console.log(this);
            this.destination.route(this.output);
        }
    };
    result.output = {
        name: result.name + ".out",
        value: result.gain
    };
    result.freqOsc = {
        on: false,
        name: result.name + ".FreqOsc",
        default: audioCtx.createOscillator(),
        source: null,
        sourceName: "none",
        route: function(output) {
            if(this.on) {
                result.toggleFreqOsc(false);
                this.source = output.value;
                this.sourceName = output.name;
                result.toggleFreqOsc(true);
            } else {
                this.source = output.value;
                this.sourceName = output.name;
            }
        },
        unroute: function() {
            if(this.on) {
                result.toggleFreqOsc(false);
                this.source = null;
                this.sourceName = "none";
                result.toggleFreqOsc(true);
            } else {
                this.source = null;
                this.sourceName = "none";
            }
        }
    };
    result.gainOsc = {
        on: false,
        name: result.name + "GainOsc",
        default: audioCtx.createOscillator(),
        source: null,
        sourceName: "none",
        route: function(output) {
            if(this.on) {
                result.toggleGainOsc(false);
                this.source = output.value;
                this.sourceName = output.name;
                result.toggleGainOsc(true);
            } else {
                this.source = output.value;
                this.sourceName = output.name;
            }
        },
        unroute: function() {
            if(this.on) {
                result.toggleGainOsc(false);
                this.source = null;
                this.sourceName = "none";
                result.toggleGainOsc(true);
            } else {
                this.source = null;
                this.sourceName = "none";
            }
        }
    };
    result.freqOsc.name = name + ".FreqOsc";
    result.gainOsc.name = name + ".GainOsc";
    result.osc.connect(result.gain);
    result.osc.start();
    result.freqOsc.default.start();
    result.gainOsc.default.start();

    return result;
};
createGain = function(name, audioCtx) {
    var result = {
        name: name,
        getInputs: function() {
            return [this.gain];
        }
    };

    result.gain = {
        on: true,
        name: result.name + ".in",
        default: audioCtx.createGain(),
        route: function(output) {
            output.value.connect(this.default);
        },
        unroute: function() { }
    };
    result.output = {
        name: result.name + ".out",
        value: result.gain
    };

    return result;
};

var app = angular.module("myApp", ['ngMaterial'])
    .directive("waveGenerator", [function() {
        var service = {
            restrict: 'E',
            scope: {
                osc: '=',
                routes: '='
            },
            templateUrl: "template/waveGenerator.html"
        };

        return service;
    }])
    .directive("gainModule", [function() {
        var service = {
            restrict: 'E',
            scope: {
                module: '='
            },
            templateUrl: "template/gainModule.html"
        };

        return service;
    }])
    .directive("filterModule", [function() {
        var service = {
            restrict: 'E',
            scope: {
                module: '='
            },
            templateUrl: 'template/filterModule.html'
        };

         return service;
    }])
    .controller("mainController", ['$scope', function($scope) {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        $scope.osc1 = createOsc("wave1", audioCtx);
        $scope.osc2 = createOsc("wave2", audioCtx);
        $scope.osc3 = createOsc("wave3", audioCtx);
        $scope.out = createGain("output", audioCtx);

        $scope.inputs = [].concat($scope.osc1.getInputs(), $scope.osc2.getInputs(), $scope.osc3.getInputs(),$scope.out.getInputs());

        $scope.$watch("osc1.destination", function(newVal, oldVal) {
            var oldInput, newInput;
            $scope.inputs.forEach(function(e) {
                if(e.name == newVal) {
                    newInput = e;
                }

                if(oldVal != null && e.name == oldVal) {
                    oldInput = e;
                }
            });

            if(oldVal != null) {
                oldInput.unroute();
            }

            if(newVal != null) {
                newInput.route($scope.osc1.output);
            }
        });

        $scope.$watch("osc2.destination", function(newVal, oldVal) {
            var oldInput, newInput;
            $scope.inputs.forEach(function(e) {
                if(e.name == newVal) {
                    newInput = e;
                }

                if(oldVal != null && e.name == oldVal) {
                    oldInput = e;
                }
            });

            if(oldVal != null) {
                oldInput.unroute();
            }

            if(newVal != null) {
                newInput.route($scope.osc2.output);
            }
        });

        $scope.$watch("osc3.destination", function(newVal, oldVal) {
            var oldInput, newInput;
            $scope.inputs.forEach(function(e) {
                if(e.name == newVal) {
                    newInput = e;
                }

                if(oldVal != null && e.name == oldVal) {
                    oldInput = e;
                }
            });

            if(oldVal != null) {
                oldInput.unroute();
            }

            if(newVal != null) {
                newInput.route($scope.osc3.output);
            }
        });

        //$scope.modules = [$scope.osc1];


        //$scope.filter.types = ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass'];
        //$scope.osc1.connect($scope.finalGain);
        //$scope.osc2.connect($scope.finalGain);

        on = false;
        $scope.play = function() {
            if(on) {
                on = false;
                $scope.out.gain.default.disconnect(audioCtx.destination);
            } else {
                on = true;
                $scope.out.gain.default.connect(audioCtx.destination);
            }
        };
    }]);