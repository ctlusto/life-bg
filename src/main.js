(function() {

    var d3 = require('d3');
    var Grid = require('./grid.js');

    var Life = function(opts) {
        this.opts = opts || {};
        this.opts.elt = this.opts.elt || 'body';
        this.opts.gridWidth = this.opts.width || this.opts.elt.width || window.innerWidth;
        this.opts.gridHeight = this.opts.height || this.opts.elt.height || window.innerHeight;
        this.opts.color = this.opts.color || '#4f81bd';
        this.opts.cellSize = this.opts.cellSize || this.opts.gridWidth/50;
        this.opts.speed = this.opts.speed || 200;
        this.opts.density = this.opts.density || 0.5;
    };

    Life.prototype.init = function() {
        var _this = this,
            w = this.opts.gridWidth,
            h = this.opts.gridHeight,
            cellSize = this.opts.cellSize,
            columns = Math.floor(h/cellSize),
            rows = Math.floor(w/cellSize);

        var grid = new Grid(rows,columns);
        grid.setRandom(this.opts.density);

        var svg = d3.select(this.opts.elt).append("svg:svg")
            .attr("width", w)
            .attr("height", h);

        var rect = svg.selectAll("rect");

        (function(){
            grid.step();

            rect = rect.data(grid.aliveCells(),function(d){return d.n});
            rect.enter().append("rect")
                    .attr("x", function(d){return d.x*cellSize})
                    .attr("y", function(d){return d.y*cellSize})
                    .attr('width', cellSize)
                    .attr('height', cellSize)
                    .style('fill', _this.opts.color);

            rect.exit().remove();

            setTimeout(arguments.callee, _this.opts.speed);
        })();
    };

    module.exports = Life;

})();



