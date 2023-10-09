class CuyMovement {
    constructor(options) {
        
        this.cuy = options.cuy;
        this.cuy.model.visible = true;
        this.cuy.modelCuyChoque.visible = false;
        this.t = options.t;//progreso animation
        this.dt = 0.0015; //delta time 

        this.up = new THREE.Vector3(0,0,1 );
        this.axis = new THREE.Vector3( );

        this.inicio = 
            {
                x : this.cuy.model.position.x,
                y : this.cuy.model.position.y,
                z : this.cuy.model.position.z
            };
        this.spline = new THREE.CatmullRomCurve3(this.puntos_azar(this.inicio));
        this.callback = options.callback;
        // this.callback = function()
        // {
        //     this.detener_animacion_correr_cuy();
        //     var posicion_actual = 
        //         {
        //             x : this.cuy.model.position.x,
        //             y : this.cuy.model.position.y,
        //             z : this.cuy.model.position.z
        //         };
        //     this.spline = new THREE.CatmullRomCurve3(this.puntos_azar(posicion_actual));
        //     this.correr_cuy();
        // }
    }
    correr_cuy(){                
        this.animacion_correr_cuy = requestAnimationFrame(this.correr_cuy.bind(this));// Keep the context of 'this'        
        var pt = this.spline.getPoint( this.t );
        
        this.cuy.model.position.set( pt.x, pt.y, pt.z );
        this.cuy.mixer.update(this.cuy.clock.getDelta())
        
        var tangent = this.spline.getTangent( this.t ).normalize();
        this.axis.crossVectors(this.up, tangent).normalize();
        var radians = Math.acos( this.up.dot( tangent ) );
        this.cuy.model.quaternion.setFromAxisAngle( this.axis, radians );
        this.t += this.dt;
        if(this.t >= 1)//fin animation
        {
            this.callback();

            var fin_tiempof = performance.now();
            var milisegundosf = (fin_tiempof - this.inicio_tiempo);
            console.info("TIEMPO FINAL spLine=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : "+ milisegundosf );
        }
    }
    puntos_azar(desde){
        var arrayvector = [];
        arrayvector.push(new THREE.Vector3(desde.x,0,desde.z));
        for(var a = 0 ; a < 10 ; a++ ){
            let nuevo = this.generar_nueva_posicion_random2(2.35);
            arrayvector.push(new THREE.Vector3(nuevo.x,0,nuevo.z))
        }
        return arrayvector;
    }
    generar_nueva_posicion_random2(rango){
        var randomx = Math.random() >= 0.5 ? Math.abs(parseFloat(this.random_posicion(0, rango))) : -Math.abs(parseFloat(this.random_posicion(0,rango))) ;  // rango x=> -2.5  a   2.5 
        var randomz = Math.random() >= 0.5 ? Math.abs(parseFloat(this.random_posicion(0, rango))) : -Math.abs(parseFloat(this.random_posicion(0, rango))); // rango z=> -2.5  a   2.5
        var b = { x: randomx, y: 0, z: randomz  };
        return b;
    }
    random_posicion(min, max) {
        return ((Math.random() * (max - min)) + min).toFixed(2);
    }
    detener_animacion_correr_cuy(){/*stop cuy en portada */
        if(typeof this.animacion_correr_cuy != "undefined"){
             cancelAnimationFrame(this.animacion_correr_cuy);
             this.t = 0;
             delete this.animacion_correr_cuy;
        }
    }
    correr_spline(){
        this.var_correr = requestAnimationFrame(this.correr_spline.bind(this));
        this.pt = this.spline.getPoint( this.t_spline_ganador );
        this.model.position.set( this.pt.x, this.pt.y, this.pt.z );
        this.tangent = this.spline.getTangent( this.t_spline_ganador ).normalize();
        this.mixer.update(this.clock.getDelta())
        this.axis.crossVectors(this.up, this.tangent).normalize();
        this.radians = Math.acos( this.up.dot( this.tangent ) );
        this.model.quaternion.setFromAxisAngle( this.axis, this.radians );
        this.t_spline_ganador = this.t_spline_ganador + this.dtSPLINE;
        console.log(this.t_spline_ganador);
        if(this.t_spline_ganador >= 1){
            this.model.position.copy(this.posicion_fin_caja);
            this.t_spline_ganador = 0;
            cancelAnimationFrame(this.var_correr);
                // console.info("FIN SPLINE");
            this.CUY_CORRIENDO = false;
            if( this.model.position.x == this.posicionmadera.x && 
                this.model.position.z == this.posicionmadera.z
            )
            {
                this.modelCuyChoque.position.copy(this.posicionmodel);
                this.modelCuyChoque.lookAt(this.getObjeto_caja("x").getWorldPosition());
                this.modelCuyChoque.position.y = -0.1;
                this.cuychoque();
                this.cajax_animacion();///caja x voltear
            }
            this.model.visible = false;
            this.callback_ganador();
            var fin_tiempof = performance.now();
            var milisegundosf = (fin_tiempof - this.inicio_tiempo);
            console.info("TIEMPO FINAL=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : "+ milisegundosf );
        }
    }
}

export { CuyMovement }