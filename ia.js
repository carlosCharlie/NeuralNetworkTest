
let ias = [];

window.onload = function(){

    ias.push(new Ia(document.getElementById("tracker0"),0.2,[0,0]));
    ias.push(new Ia(document.getElementById("tracker1"),0.05,[window.innerWidth/2.1,0]));
    ias.push(new Ia(document.getElementById("tracker2"),0.03,[0,window.innerHeight-100]));
    ias.push(new Ia(document.getElementById("tracker3"),0.01,[window.innerWidth/2.1,window.innerHeight-100]));

    document.body.onmousemove = function(event){
        
        ias.forEach(ia=>ia.refreshTarget(event));
    };

    setInterval(() => {
        ias.forEach(ia=>ia.move());
    }, 40);

}

class Ia{

    constructor(htmlElement,learningRate,initCoor){

        this.network = new synaptic.Architect.Perceptron(2, 3, 2);
        this.learningRate = learningRate;
        this.actualCoor = initCoor;
        this.targetCoor = this.actualCoor.map(c=>c+1);
        this.htmlElement = htmlElement;

    }

    refreshTarget(event){

        this.targetCoor = this.network.activate([event.clientX,event.clientY]);
        this.targetCoor[0] = this.targetCoor[0]*window.innerWidth;
        this.targetCoor[1] = this.targetCoor[1]*window.innerHeight;

        this.network.propagate(this.learningRate, [(event.clientX-50)/window.innerWidth,(event.clientY-50)/window.innerHeight]);
    
        this.htmlElement.innerHTML = "learning <br> Rate: "+this.learningRate+"<br><br>"+"error: "+Math.round((Math.abs(this.targetCoor[0]-window.event.clientX)+Math.abs(this.targetCoor[1]-window.event.clientY))/2);
    }

    move(){

        let v = [this.targetCoor[0]-this.actualCoor[0],this.targetCoor[1]-this.actualCoor[1]];

        this.actualCoor = v.map((c,i)=>(this.actualCoor[i]+(c/Math.sqrt(Math.pow(v[0],2)+Math.pow(v[1],2)))));

        if(Math.abs(this.actualCoor[0]-this.targetCoor[0])>=2)
            this.htmlElement.style.transform = "translate("+Math.round(this.actualCoor[0])+"px,"+Math.round(this.actualCoor[1])+"px)";
    
        return;
    }


}