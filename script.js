
let c=document.getElementById("tabla");
let ct=c.getContext("2d");

let jatek={
	N:3,
	lepes:11,
	nehez:false,
	vege:false,
	szint:1,
	jo:false,
	sajatmod:false
}
let tablazat=new Array(12);
let solution=[jatek.N];


function think(){
	for(let i=0;i<jatek.N;i++){
		solution[i]=Math.floor((Math.random()*6)+1);
	}
}
function writeRow(array){
	for(let i=0;i<array.length;i++){
		console.log(array[i]);
	}
}
//0 nincs benne,1 nemjohelyen,2 jo helyen
function check(array){
	let out=[array.length];
	let arraytmp=array.slice();
	let solutiontmp=solution.slice();
	for(let i=0;i<arraytmp.length;i++){
		out[i]=0;
		if(arraytmp[i]==solutiontmp[i]){
			solutiontmp[i]=0;
			arraytmp[i]=-1;
			out[i]=2;
		}
	}
	
	for(let i=0;i<arraytmp.length;i++){
		
		if(arraytmp[i]==-1)continue;
		let isin=false;
		let j=0;
		while(!isin && j<arraytmp.length){
			isin=(arraytmp[i]==solutiontmp[j]);
			j++;
		}
		if(isin){
			arraytmp[i]=-1;
			solutiontmp[j-1]=0;
			out[i]=1;
		}else{
			out[i]=0;
		}
	   	
    }
    return out;
}
//--------------------------------------------Barkácsolás-------------------
let meret=c.height/14;
//let dragg=false;
let images=[];
let segedtabla=new Array(12);

let vonszolas={
	x:0,
	y:0,
	height:meret,
	width:meret,
	dragged:false,
	kep:0
}
window.onload = function(){drawKepek();};
c.addEventListener("pointerdown",function(e){
	//dragg=true;
	if(!jatek.vege){
	let x=e.clientX;
	let y=e.clientY;
	for(let i=1;i<=6;i++){
		if(images[i].x<=x && images[i].x+images[i].width>x && images[i].y<=y && images[i].y+images[i].height){
			vonszolas.dragged=true;
			vonszolas.x=x-images[i].width/2;
			vonszolas.y=y-images[i].height/2;
			vonszolas.width=images[i].width;
			vonszolas.height=images[i].height;
			vonszolas.kep=i;
			break;
		}
	}
    }
});
c.addEventListener("pointerup",function(e){
	//dragg=false;
	if(!jatek.vege){
	if(vonszolas.dragged){
    	let x=e.clientX;
     	let y=e.clientY;
	    for(let i=0;i<jatek.N;i++){
		   if(tablazat[jatek.lepes][i].x<=x && tablazat[jatek.lepes][i].x+tablazat[jatek.lepes][i].width>x && tablazat[jatek.lepes][i].y<=y && tablazat[jatek.lepes][i].y+tablazat[jatek.lepes][i].height>y){
			   tablazat[jatek.lepes][i].imag=vonszolas.kep;
		   }
	    }
        vonszolas.dragged=false;
        if(isFull()){
			nextRow();
		}
    }
    	
    draw();
    }
});
c.addEventListener("pointermove",function(e){
	let x=e.clientX;
	let y=e.clientY;
	if(vonszolas.dragged){
		ct.clearRect(0,0,c.width,c.height);
		vonszolas.x=x-vonszolas.width/2;
	    vonszolas.y=y-vonszolas.height/2;
	    drawDrag();
	}
});
function nextRow(){
	let array=[jatek.N];
	for(i=0;i<jatek.N;i++){
		array[i]=tablazat[jatek.lepes][i].imag;
	}
	array=check(array);
	let l=true;
	let j=0;
	while(l && j<array.length){
		l=array[j]==2;
		j++;
	}
	jatek.lepes--;
	if(l || jatek.lepes<0){
		endGame(l);
	} else {
	   let k=0;
	   for(i=0;i<jatek.N;i++){
		  if(array[i]==2){
		    if(!jatek.nehez){tablazat[jatek.lepes][i].imag=tablazat[jatek.lepes+1][i].imag;}else{
		    tablazat[jatek.lepes+1][i].petty=2;}
	      } 
	      if(array[i]==1){
			  if(!jatek.nehez){segedtabla[jatek.lepes][k].imag=tablazat[jatek.lepes+1][i].imag;}else{
			  tablazat[jatek.lepes+1][i].petty=1;}
			  k++;
		  }
	   }
	}  
}
function endGame(l){
	jatek.jo=l;
	jatek.vege=true;
	//document.getElementById("ujj").style.display="block";
	if(!jatek.sajatmod){
	  if(jatek.lepes>=4){
		 jatek.szint++;
	  }
	  else{
		 jatek.szint=1;
	  }
      if(jatek.szint>=4 && !jatek.nehez){
		  jatek.nehez=true;
		  jatek.szint=1;
	   }
    }
}
function drawSolution(){ 
	let oszto=jatek.nehez?8:jatek.N*2;
    let ch=c.height/14<c.width/oszto ?c.height/14:c.width/oszto;
	if(jatek.vege){
	    ct.beginPath();
	    ct.fillStyle="green";
	    
	    for(let i=0;i<jatek.N;i++){
		   ct.fillRect(i*ch,1,ch,ch);
	       ct.drawImage(images[solution[i]].imag,i*ch+ch/10,1,ch-ch/5,ch-ch/5);
	       
	    }
	    ct.stroke();
    }else{
		ct.beginPath();
	    for(let k=0;k<jatek.N;k++){
		   
	       ct.drawImage(images[0].imag,k*ch+ch/10,1,ch-ch/5,ch-ch/5);
	    }
	    ct.stroke();

	    
	}
      
	  
	   
}
function isFull(){
	let l=true;
	let i=0;
	while(i<jatek.N && l){
		l=tablazat[jatek.lepes][i].imag!=0;
		i++;
	}
	return l;
	
}
function drawDrag(){
	draw();
	ct.beginPath();
	ct.drawImage(images[vonszolas.kep].imag,vonszolas.x,vonszolas.y,vonszolas.width,vonszolas.height);
	ct.stroke();
	
}
function drawTable(){
	//let cw=c.width/6;
	let oszto=jatek.nehez?8:jatek.N*2;
	let ch=c.height/14<c.width/oszto ?c.height/14:c.width/oszto;
	ct.beginPath();
	/*document.getElementById("ujj").style.left= (jatek.N*ch)+"px";
	document.getElementById("ujj").style.height=ch+"px";
	document.getElementById("ujj").style.width=ch+"px";
	document.getElementById("ujj").style.fontSize=ch/5+"px";
	document.getElementById("exit").style.left=((jatek.N)*ch+ch)+"px";
	document.getElementById("exit").style.height=ch+"px";
	document.getElementById("exit").style.width=ch+"px";*/
	for (let i=0;i<tablazat.length;i++){
		for(let j=0;j<jatek.N;j++){
			ct.fillStyle="brown";
	        ct.strokeStyle="black";
			tablazat[i][j].x=j*ch;
			tablazat[i][j].y=i*ch+ch;
	        tablazat[i][j].width=ch;
	        tablazat[i][j].height=ch;
	           if(jatek.lepes+1==i && jatek.vege && jatek.jo) ct.fillStyle="green";
	           if(jatek.lepes+1==i && jatek.vege && !jatek.jo) ct.fillStyle="red";
			   ct.fillRect(tablazat[i][j].x,tablazat[i][j].y,tablazat[i][j].width,tablazat[i][j].height);
			   ct.beginPath();
			   ct.arc(tablazat[i][j].x+ch/2,tablazat[i][j].y+ch/2-ch/10,ch/2-ch/10,0, 2 * Math.PI);
			   ct.stroke();
		    if(tablazat[i][j].imag!=0){ 
				ct.beginPath();
	            ct.drawImage(images[tablazat[i][j].imag].imag,tablazat[i][j].x+ch/10,tablazat[i][j].y,tablazat[i][j].width-ch/5,tablazat[i][j].height-ch/5);
	            ct.stroke();
			}
			if(jatek.nehez){
			   if(tablazat[i][j].petty==1){
			     ct.fillStyle="black";
			     ct.beginPath();
			     ct.arc(tablazat[i][j].x+ch/2,tablazat[i][j].y+ch-ch/10,ch/10,0, 2 * Math.PI);
			     ct.fill();
			     ct.stroke();
			   }
			   if(tablazat[i][j].petty==2){
			      ct.fillStyle="white";
			      ct.beginPath();
			      ct.arc(tablazat[i][j].x+ch/2,tablazat[i][j].y+ch-ch/10,ch/10,0, 2 * Math.PI);
			      ct.fill();
			      ct.stroke();
			   }
		}else{
			   segedtabla[i][j].x=j*ch+jatek.N*ch;
			   segedtabla[i][j].y=i*ch+ch;
			   segedtabla[i][j].width=ch;
			   segedtabla[i][j].height=ch;
			   if(segedtabla[i][j].imag!=0){
				  ct.beginPath();
				  ct.globalAlpha = 0.5;
	              ct.drawImage(images[segedtabla[i][j].imag].imag,segedtabla[i][j].x,segedtabla[i][j].y,segedtabla[i][j].width,segedtabla[i][j].height);
	              ct.globalAlpha = 1;
	              ct.stroke();
			  }
		   }
	    }
	}
	ct.stroke();
}
function drawKepek(){
	let oszto=jatek.nehez?8:jatek.N*2;
    let ch=c.height/14<c.width/oszto ?c.height/14:c.width/oszto ;
    ct.beginPath();
	for(let i=1;i<=6;i++){
	   images[i].x=i*ch-ch;
	   images[i].y=ch*13;
	   images[i].width=ch;
	   images[i].height=ch;
	   ct.drawImage(images[i].imag,images[i].x,images[i].y,images[i].width,images[i].height);
	   ct.stroke();
    }
    ct.stroke();

    
}
function draw(){
	ct.clearRect(0,0,c.width,c.height);
	drawTable();
	drawKepek();
	drawSolution();
	

}
function resizeCanvas(){
	c.width=window.innerWidth;
	c.height=window.innerHeight;
	//c.style.border="1px solid red";
	alert('canvas');

	draw();
}
function newGame(){
	if(jatek.szint>=4 && jatek.nehez){
		jatek.szint=1;
		jatek.N=4;
	}
	meret=c.height/14;
	for (let i = 0; i < 12; i++) {
     tablazat[i] = new Array(jatek.N);
     segedtabla[i]=new Array(jatek.N);
      for(j=0;j<jatek.N;j++){
		 let kep={
			x:i*meret-meret,
			y:c.height-meret,
			height:meret,
			width:meret,
			imag:0,
			petty:0
		}
		let kep2={
			x:i*meret-meret,
			y:c.height-meret,
			height:meret,
			width:meret,
			imag:0
		}
		segedtabla[i][j]=kep2;
		tablazat[i][j]=kep;
	  }
    }
    
    think();
    jatek.lepes=11;
    jatek.vege=false;
    //document.getElementById("ujj").style.display="none";
    draw();
}
function init(){
	window.addEventListener('resize', resizeCanvas, false);
	let meret=c.height/14;
    for(let i=0;i<=6;i++){
		img=document.getElementById(i.toString());
		let kep={
			x:i*meret-meret,
			y:c.height-meret,
			height:meret,
			width:meret,
			imag:img
		}
		images[i]=kep;
	}
	newGame();
	resizeCanvas();

	/*let gomb=document.getElementById("ujj");
    gomb.style.top="0px";
    gomb.style.left= (jatek.N*c.height/14+5)+"px";
	gomb.style.display="none";*/
    
}
function setGame(images,hard,mod){
	jatek.N=images;
	jatek.nehez=hard;
	jatek.sajatmod=mod;
}
function baseState(){
	jatek.N=3;
	jatek.lepes=11;
	jatek.nehez=false;
	jatek.vege=false;
	jatek.szint=1;
	jatek.jo=false;
	jatek.sajatmod=false;
}
//init();
