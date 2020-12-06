Array.prototype.average = function() {
    if (this.length == 0) return 0;
    return Math.round((this.reduce((a, b) => (a + b), 0) / this.length * 100)) / 100; // Somma / lunghezza
};