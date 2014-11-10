(function() {

    var Cell = require('./cell.js');

    var Grid = function(rows, columns) {
        this.cells = new Array(rows);
        var n = 0;
        this.cells = [];
        for (var i=0; i<rows; i++) {
            var _row = [];
            for (var j=0; j<columns; j++) {
                var cell = new Cell(false);
                cell.n = n++;
                cell.x = i;
                cell.y = j;
                _row.push(cell);
            }
            this.cells.push(_row);
        }
    }

    Grid.prototype.aliveNeighborsFor = function(x, y) {
        var _this = this,
            neighbors = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

        function isAliveAt(i, j){
            if(i < 0 || i >= _this.cells.length || j < 0 || j >= _this.cells[0].length){
                return false;
            }
            return _this.cells[i][j].isAlive;
        }

        var count = 0;
        for(var i = 0; i < neighbors.length; i++){
            count += (isAliveAt(x+neighbors[i][0],y+neighbors[i][1]))?1:0;
        }

        return count;
    };

    Grid.prototype.eachCell = function(callback){
        var rows = this.cells.length,
            columns = this.cells[0].length,
            x,y;
        for(var i = 0; i < rows * columns; i++){
            x = i%rows; y = Math.floor(i/rows);
            callback.apply(this,[this.cells[x][y],x,y]);
        }
    };

    Grid.prototype.setRandom = function(density) {
        this.eachCell(function(cell,x,y){
            cell.isAlive = (Math.random() < density);
        });
    };

    Grid.prototype.prepareStep = function() {
        this.eachCell(function(cell,x,y){
            cell.computeNextState(this.aliveNeighborsFor(x,y));
        });
    };

    Grid.prototype.step = function() {
        this.prepareStep();
        this.eachCell(function(cell,x,y){
            cell.nextState();
        });
    };

    Grid.prototype.aliveCells = function() {
        var alive = [];
        this.eachCell(function(cell){
            cell.isAlive && alive.push(cell);
        });
        return alive;
    };

    module.exports = Grid;

})();