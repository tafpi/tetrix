(function () {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;
    document.body.appendChild(canvas);

    var blocksX = 40;
    var blocksY = 40;
    var blockWidth = canvas.width / blocksX;          // matrix square width
    var blockHeight = canvas.height / blocksY;        // matrix square height
    var blockMatrix = [];
    var mergedMatrix = [];
    var mergeLimit = 4;

    var durMin = 100;
    var durMax = 2000;

    // create initial matrix
    for (let i = 0; i < blocksY; i++) {
        for (let j = 0; j < blocksX; j++) {
            var block = new Block();
            block.row = i;
            block.col = j;
            block.x = j * block.w;
            block.y = i * block.h;
            block.path = blockPath(block);
            blockMatrix.push(block);
        }
    }

    //  draw matrix
    // for (let i = 0; i < blockMatrix.length; i++) {
    //     var b = blockMatrix[i];
    //     ctx.fillStyle = getRandomColor();
    //     ctx.fillRect(b.x, b.y, b.w, b.h);
    // }

    // merge blocks randomly
    for (let i = 0; i < blocksY; i++) {
        for (let j = 0; j < blocksX; j++) {
            var index = i * blocksX + j;
            if (i > 0) {
                // console.log('up');
                mergeBlocks(blockMatrix[index], blockMatrix[index - blocksX]);
            }
            if (j < blocksX - 1) {
                // console.log('right');
                mergeBlocks(blockMatrix[index], blockMatrix[index + 1]);
            }
            if (i < blocksY - 1) {
                // console.log('down');
                mergeBlocks(blockMatrix[index], blockMatrix[index + blocksX]);
            }
            if (j > 0) {
                // console.log('left');
                mergeBlocks(blockMatrix[index], blockMatrix[index - 1]);
            }
        }
    }

    var img = document.getElementById('image');

    // draw merged matrix
    for (let i = 0; i < mergedMatrix.length; i++) {
        for (let j = 0; j < mergedMatrix[i].blocks.length; j++) {
            var b = mergedMatrix[i].blocks[j];
            if ((i == mergedMatrix.length - 1) && (j == mergedMatrix[i].blocks.length - 1)) {
                startAnimation();
            }
        }
        // for (let j = 0; j < mergedMatrix[i].blocks.length; j++) {
        //     var b = mergedMatrix[i].blocks[j];
        //     if (Math.round(Math.random()) == 1) {
        //         ctx.fillStyle = getRandomColor();
        //         ctx.fillRect(b.x, b.y, b.w, b.h);
        //     } else {
        //         ctx.drawImage(img, b.x, b.y, b.w, b.h, b.x, b.y, b.w, b.h);
        //     }
        // }
    }

    var start = null;

    //  OBJECT CONSTRUCTORS

    function Block() {
        this.row = 0;           //  row index
        this.col = 0;           //  column index
        this.x = 0;             //  upper-left x position
        this.y = 0;             //  upper-left y position
        this.w = blockWidth;    //  width
        this.h = blockHeight;   //  height
        this.path;              //  path
        this.parent;            //  parent merged
    }

    function Merged() {
        this.index;
        this.blocks = [];       //  blocks that made this polygon
        this.path;
        this.duration = 0;
        this.opacity = 0;
        this.distance = blockHeight;
    }


    //  FUNCTIONS

    function startAnimation() {
        window.requestAnimationFrame(step);
    }

    function step(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        // console.log(progress);
        for (let i = 0; i < mergedMatrix.length; i++) {
            for (let j = 0; j < mergedMatrix[i].blocks.length; j++) {
                var b = mergedMatrix[i].blocks[j];
                if (progress < b.parent.duration) {
                    ctx.globalAlpha = b.parent.opacity + 100 / b.parent.duration;
                    var positionY = b.y + b.parent.distance - b.parent.distance*(1 - progress/durMax);
                    ctx.drawImage(img, b.x, b.y, b.w, b.h, b.x, positionY, b.w, b.h);
                }
            }
        }
        if (progress < durMax) {
            window.requestAnimationFrame(step);
        }
    }

    function blockPath(b) {
        var path = new Path2D();
        path.rect(b.x, b.y, b.w, b.h);
        return path;
    }

    function mergeBlocks(b1, b2) {
        //  merge b2 to b1

        if (adjacent(b1, b2)) {
            if (!b1.parent) {
                var m = new Merged();
                b1.parent = m;
                m.blocks.push(b1);
                m.index = mergedMatrix.length;
                m.duration = Math.floor(Math.random() * (durMax - durMin + 1) + durMin);
                // console.log(m.duration);
                mergedMatrix.push(m);
                if (!b2.parent) {
                    if (Math.round(Math.random()) == 1) {
                        b2.parent = b1.parent;
                        b1.parent.blocks.push(b2);
                    }
                }
            } else {
                if (b1.parent.blocks.length < mergeLimit) {
                    if (!b2.parent) {
                        if (Math.round(Math.random()) == 1) {
                            b2.parent = b1.parent;
                            b1.parent.blocks.push(b2);
                        }
                    }
                }
            }
        }
    }

    function adjacent(b1, b2) {
        if ((b1.row == b2.row) && (b2.x == b1.x + b1.w || b1.x == b2.x + b2.w)) {
            return true;
        }
        if ((b1.col == b2.col) && (b2.y == b1.y + b1.h || b1.y == b2.y + b2.h)) {
            return true;
        }
    }


    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

})();