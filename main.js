(function () {

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;
    document.body.appendChild(canvas);

    var blocksX = 40;
    var blocksY = 40;
    var blockWidth = canvas.width/blocksX;          // matrix square width
    var blockHeight = canvas.height/blocksY;        // matrix square height
    var blockMatrix = [];
    var mergedMatrix = [];
    var mergeLimit = 4;
    
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
            var index = i*blocksX + j;
            if(i > 0){
                // console.log('up');
                mergeBlocks(blockMatrix[index], blockMatrix[index-blocksX]);
            }
            if(j < blocksX-1){
                // console.log('right');
                mergeBlocks(blockMatrix[index], blockMatrix[index+1]);
            }
            if(i < blocksY-1){
                // console.log('down');
                mergeBlocks(blockMatrix[index], blockMatrix[index+blocksX]);
            }
            if(j > 0){
                // console.log('left');
                mergeBlocks(blockMatrix[index], blockMatrix[index-1]);
            }
        }
    }

    // var img = new Image();
    // img.src = 'Hippo-Day-2018.jpg';   
    var img = document.getElementById('image');

    // draw merged matrix
    for (let i = 0; i < mergedMatrix.length; i++) {
        // console.log('merged group '+i);
        if(Math.round(Math.random())==1){
            ctx.fillStyle = getRandomColor();
            for (let j = 0; j < mergedMatrix[i].blocks.length; j++) {
                var b = mergedMatrix[i].blocks[j];
                ctx.fillRect(b.x, b.y, b.w, b.h);
            }

        } else {
            for (let j = 0; j < mergedMatrix[i].blocks.length; j++) {
                var b = mergedMatrix[i].blocks[j];
                ctx.drawImage(img, b.x, b.y, b.w, b.h, b.x, b.y, b.w, b.h);
            }
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
        this.index;
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
        //  merge b2 to b1

        if (adjacent(b1, b2)) {
            if(!b1.parent){
                var m = new Merged();
                b1.parent = m;
                m.blocks.push(b1);
                m.index = mergedMatrix.length;
                mergedMatrix.push(m);
                if(!b2.parent){
                    if(Math.round(Math.random())==1){
                        b2.parent = b1.parent;
                        b1.parent.blocks.push(b2);
                    }
                }
            } else {
                if (b1.parent.blocks.length < mergeLimit) {
                    if(!b2.parent){
                        if(Math.round(Math.random())==1){
                            b2.parent = b1.parent;
                            b1.parent.blocks.push(b2);
                        }
                    }
                }
            }
        }
        
        
        
        // if (adjacent(b1, b2)) {
        //     console.log(b1,b2);
        //     if(!b2.parent){
        //         if(!b1.parent){
        //             console.log('b1 orphan');
        //             var m = new Merged();
        //             b1.parent = m;
        //             m.blocks.push(b1);
        //             m.index = mergedMatrix.length;
        //             mergedMatrix.push(m);
        //             if(Math.round(Math.random())==1){
        //                 console.log('merged');
        //                 b2.parent = b1.parent;
        //                 b1.parent.blocks.push(b2);
        //             }
        //         }
        //         else {
        //             console.log('b1 child of parent');
        //             if (b1.parent.blocks.length < mergeLimit) {
        //                 if(Math.round(Math.random())==1){
        //                     console.log('merged');
        //                     b2.parent = b1.parent;
        //                     b1.parent.blocks.push(b2);
        //                 }
        //             }
        //         }
        //     }
        // }


        
        // console.log(b1,b2);
        // // console.log(adjacent(b1, b2));
        // if (adjacent(b1, b2)) {
        //     // console.log('the two are adjacent');
        //     if(!b1.parent){
        //         console.log('b1 orphan');
        //         if(!b2.parent){
        //             console.log('b2 orphan');
        //             var m = new Merged();
        //             b1.parent = m;
        //             m.blocks.push(b1);
        //             m.index = mergedMatrix.length;
        //             mergedMatrix.push(m);
        //             if(Math.round(Math.random())==1){
        //                 b2.parent = b1.parent;
        //                 b1.parent.blocks.push(b2);
        //                 console.log('b2 merged to b1');
        //             }
        //         }
        //     } else {
        //         console.log('b1 child of parent');
        //         if (b1.parent.blocks.length < mergeLimit) {
        //             if(!b2.parent){
        //                 console.log('b2 orphan');
        //                 if(Math.round(Math.random())==1){
        //                     b2.parent = b1.parent;
        //                     b1.parent.blocks.push(b2);
        //                     console.log('b2 merged to b1');
        //                 }
        //             } else {
        //                 console.log('b2 child of parent');
        //                 if (b2.parent.blocks.length + b1.parent.blocks.length < mergeLimit*2) {
        //                     // for (let k = 0; k < b2.parent.blocks.length; k++) {
        //                     //     b2.parent.blocks[k].parent = b1.parent;
        //                     //     b1.parent.blocks.push(b2.parent.blocks[k]);
        //                     // }
        //                     console.log('b2 merged to b1');                            
        //                     mergedMatrix.splice(b1.parent.index, 1);
        //                 }
        //             }
        //         }
        //     }
        // }
    }
    
    function adjacent(b1, b2) {
        // var adjacent = false;
        // if ((b1.row == b2.row)&&(Math.abs(b2.x - b1.x) == b1.w)){
        if ((b1.row == b2.row)&&(b2.x == b1.x + b1.w || b1.x == b2.x + b2.w)){
            //  adjacent horizontally
            return true;
        }
        if ((b1.col == b2.col)&&(b2.y == b1.y + b1.h || b1.y == b2.y + b2.h)){
            //  adjacent vertically
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