(function () {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.width = 300;
    canvas.height = 400;
    document.body.appendChild(canvas);

    var blocksX = 40;
    var blocksY = 60;
    var blockWidth = canvas.width/blocksX;          // matrix square width
    var blockHeight = canvas.height/blocksY;        // matrix square height
    // var blocksCount = blocksX * blocksY;
    var blockMatrix = [];
    var mergedMatrix = [];
    var mergeLimit = 6;
    
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
    for (let i = 0; i < blockMatrix.length; i++) {
        var b = blockMatrix[i];
        ctx.fillStyle = getRandomColor();
        ctx.fillRect(b.x, b.y, b.w, b.h);
    }
    
    // merge blocks randomly
    for (let i = 0; i < blocksY; i++) {
        for (let j = 0; j < blocksX; j++) {
            var index = i*blocksX + j;
            if(i > 0)
                mergeBlocks(blockMatrix[index], blockMatrix[index-blocksX]);
            if(j < blocksX-1)
                mergeBlocks(blockMatrix[index], blockMatrix[index+1]);
            if(i < blocksY-1)
                mergeBlocks(blockMatrix[index], blockMatrix[index+blocksX]);
            if(j > 0)
                mergeBlocks(blockMatrix[index], blockMatrix[index-1]);
        }
    }

    // var img = new Image();
    // img.src = 'Hippo-Day-2018.jpg';   
    var img = document.getElementById('image');
    console.log(mergedMatrix);

    for (let i = 0; i < mergedMatrix.length; i++) {
        ctx.fillStyle = getRandomColor();
        for (let j = 0; j < mergedMatrix[i].blocks.length; j++) {
            var b = mergedMatrix[i].blocks[j];
            ctx.fillRect(b.x, b.y, b.w, b.h);
            // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            // ctx.drawImage(img, b.x, b.y, b.w, b.h, b.x+30, b.y+20, b.w, b.h);
        }
    }


    //  OBJECT CONSTRUCTORS

    function Block(){
        this.row = 0;           //  row index
        this.col = 0;           //  column index
        this.x = 0;             //  upper-left x position
        this.y = 0;             //  upper-left y position
        this.w = blockWidth;    //  width
        this.h = blockHeight;   //  height
        this.path;              //  path
        this.parent;            //  parent merged
    }

    function Merged(){
        this.blocks = [];       //  blocks that made this polygon
        this.path;
    }
    

    //  FUNCTIONS

    function blockPath(b) {
        var path = new Path2D();
        path.rect(b.x, b.y, b.w, b.h);
        return path;
    }

    function mergeBlocks(b1, b2){
        //  merge b1 to b2's parent
        if(!b1.parent){
            if (adjacent(b1, b2)) {
                if (!b2.parent) {
                    console.log(b2);
                    var m = new Merged();
                    b2.parent = m;
                    m.blocks.push(b2);
                    mergedMatrix.push(b2.parent);
                    if(Math.round(Math.random())==1){
                        m.blocks.push(b1);
                        b1.parent = m;
                    }
                } else {
                    console.log('has parent')
                    if (b2.parent.blocks.length < mergeLimit) {
                        b2.parent.blocks.push(b1);
                    }
                }
            }
        }
    }
    
    function adjacent(b1, b2) {
        var adjacent = false;
        if ((b1.row == b2.row)&&(b2.x == b1.x + b1.w || b1.x == b2.x + b2.w)){
            //  adjacent horizontally
            adjacent = true;
        }
        if ((b1.col == b2.col)&&(b2.y == b1.y + b1.h || b1.y == b2.y + b2.h)){
            //  adjacent vertically
            adjacent = true;
        }
        return adjacent;        
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