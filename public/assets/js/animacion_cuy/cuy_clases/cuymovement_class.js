class CuyMovement {
    constructor(options) {
        this.inicio_tiempo = performance.now() ;
        this.cuy = options.cuy;
        this.cuy.model.visible = true;
        this.cuy.modelCuyChoque.visible = false;
        this.t = options.t;//progreso animation
        this.dt = 0.004; //delta time 
        this.desiredFPS = 60; // Set your desired frames per second
        this.desiredTotalDuration = 15; // Set your desired total duration (in seconds)
        this.desiredSpeed = 1.0; // Set your desired speed factor (1.0 is normal speed)
        // this.dt = 1 / (this.desiredFPS * this.desiredTotalDuration); 
        this.desiredFPS = 1 / (this.desiredTotalDuration * this.desiredSpeed);

        this.up = new THREE.Vector3(0,0,1 );
        this.axis = new THREE.Vector3( );
        // this.dt = this.desiredDuration / this.frameRate;
        // this.desiredDuration = 10;
        // this.frameRate = 60; // Frames per second (adjust as needed)
        // this.dt = 1 / this.frameRate;
        // this.numFrames = Math.floor(this.desiredDuration / this.dt);
        
        this.inicio = 
            {
                x : this.cuy.model.position.x,
                y : this.cuy.model.position.y,
                z : this.cuy.model.position.z
            }; 
        this.contador_request = 0;
        this.spline_control_points = 100;

        this.duracion = options.duracion ? options.duracion : 10;
        this.spline_control_points = 3;

        this.controlPoints = this.puntos_azar(this.inicio);
        this.desiredDuration = 10;
        // this.frameRate = 60; // Frames per second (adjust as needed)
        // this.numFrames = Math.floor(this.desiredDuration / this.dt);
        // this.dt = this.desiredDuration / (this.controlPoints.length - 1) / this.frameRate;

        // this.desiredDuration = 15;
        // this.frameRate = 60; // Frames per second (adjust as needed)
        // this.numFrames = Math.floor(this.desiredDuration * this.frameRate);
        // this.speedfactor = 1;
        // this.dt = (1 / this.numFrames) * this.speedfactor;
        // this.dt =    (1 / this.numFrames) * (1 / this.speedfactor);

        this.spline = new THREE.CatmullRomCurve3(this.controlPoints);
        
        // this.totalSplineLength = this.spline.getLength();
        // this.speed = this.totalSplineLength / this.desiredDuration;
        // this.frameRate = 60; // Frames per second (adjust as needed)
        // this.dt = this.speed / this.frameRate;
        // this.numFrames = Math.floor(this.desiredDuration * this.frameRate);

        this.callback = options.callback;
        // this.inicio_tiempo = performance.now();
        // // this.callback = function()
        // // {
        // //     this.detener_animacion_correr_cuy();
        // //     var posicion_actual = 
        // //         {
        // //             x : this.cuy.model.position.x,
        // //             y : this.cuy.model.position.y,
        // //             z : this.cuy.model.position.z
        // //         };
        // //     this.spline = new THREE.CatmullRomCurve3(this.puntos_azar(posicion_actual));
        // //     this.correr_cuy();
        // // }

        // this.desiredDuration = 10; // seconds
        // this.frameRate = 60; // frames per second
        // this.dt = (1 / this.desiredDuration) * (1 / this.frameRate);
        // this.totalDuration = 5;
        // this.speedFactor = 0.1; // Adjust this speed factor as needed

        this.animacion_correr_cuy;
        this.animacion_cuydudando;
        this.clockjugada = new THREE.Clock();
    }

    correr_cuyA() {
        this.mostrar_cuymoviendo();
        var elapsedSeconds = this.clockjugada.getElapsedTime();
        var normalizedTime = (elapsedSeconds / this.duracion);
        if (normalizedTime <= 1.0) {
            var pt = this.spline.getPointAt( normalizedTime );
            this.cuy.model.position.set( pt.x, pt.y, pt.z );
            this.cuy.mixer.update(this.cuy.clock.getDelta())
            
            var tangent = this.spline.getTangent( normalizedTime ).normalize();
            this.axis.crossVectors(this.up, tangent).normalize();
            var radians = Math.acos( this.up.dot( tangent ) );
            this.cuy.model.quaternion.setFromAxisAngle( this.axis, radians );

            this.animacion_correr_cuy = requestAnimationFrame(this.correr_cuyA.bind(this));
        }
    }

    correr_cuyNEW() {
        this.mostrar_cuymoviendo();
        this.animacion_correr_cuy = requestAnimationFrame(this.correr_cuyNEW.bind(this));
        var pt = this.spline.getPoint(this.t);
    
        this.cuy.model.position.set(pt.x, pt.y, pt.z);
        this.cuy.mixer.update(this.cuy.clock.getDelta());
    
        var tangent = this.spline.getTangent(this.t).normalize();
        this.axis.crossVectors(this.up, tangent).normalize();
        var radians = Math.acos(this.up.dot(tangent));
        this.cuy.model.quaternion.setFromAxisAngle(this.axis, radians);
    
        // this.t += this.speedFactor * this.dt; // Adjust the position along the spline based on the speed factor
        this.t += this.dt;
        //1 / (this.desiredFPS * this.desiredTotalDuration); // Adjust the position along the spline based on the desired FPS and total duration
        if (this.t >= 1) {
            var fin_tiempof = performance.now();
            var milisegundosf = (fin_tiempof - this.inicio_tiempo);
            console.info( this.contador_request + " TIEMPO FINAL spLine=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : "+ milisegundosf );
            if(this.callback){
                this.callback();
            }

            //this.detener_animacion_correr_cuy();
            // Handle animation completion or looping here
        }
    }
    correr_cuy_indefinido(){                
        this.animacion_correr_cuy = requestAnimationFrame(this.correr_cuy_indefinido.bind(this));// Keep the context of 'this'        
        this.contador_request++;
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
            this.t = 0;
            var posicion_actual = 
            {
                x : this.cuy.model.position.x,
                y : this.cuy.model.position.y,
                z : this.cuy.model.position.z
            };
            this.spline = new THREE.CatmullRomCurve3(this.puntos_azar(posicion_actual));
            this.correr_cuy_indefinido();
            
            var fin_tiempof = performance.now();
            var milisegundosf = (fin_tiempof - this.inicio_tiempo);
            console.info( this.contador_request + " TIEMPO FINAL spLine=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : "+ milisegundosf );
            this.detener_animacion_correr_cuy();
        }
    }
    correr_cuyganador(){                
        this.animacion_correr_cuy = requestAnimationFrame(this.correr_cuy.bind(this));// Keep the context of 'this'        
        this.contador_request++;
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
            if(this.callback){
                this.callback();
            }

            var fin_tiempof = performance.now();
            var milisegundosf = (fin_tiempof - this.inicio_tiempo);
            console.info( this.contador_request + " TIEMPO FINAL spLine=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : "+ milisegundosf );
            this.detener_animacion_correr_cuy();
        
        }
    }
    correr_cuy(){                
        this.animacion_correr_cuy = requestAnimationFrame(this.correr_cuy.bind(this));// Keep the context of 'this'        
        this.contador_request++;
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
            if(this.callback){
                this.callback();
            }

            var fin_tiempof = performance.now();
            var milisegundosf = (fin_tiempof - this.inicio_tiempo);
            console.info( this.contador_request + " TIEMPO FINAL spLine=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : "+ milisegundosf );
            this.detener_animacion_correr_cuy();
        
        }
    }
    correr_cuy3(){                
        this.animacion_correr_cuy = requestAnimationFrame(this.correr_cuy3.bind(this));// Keep the context of 'this'        
        var pt = this.spline.getPoint( this.t );
        
        this.cuy.model.position.set( pt.x, pt.y, pt.z );
        this.cuy.mixer.update(this.cuy.clock.getDelta())
        
        var tangent = this.spline.getTangent( this.t ).normalize();
        this.axis.crossVectors(this.up, tangent).normalize();
        var radians = Math.acos( this.up.dot( tangent ) );
        this.cuy.model.quaternion.setFromAxisAngle( this.axis, radians );

        this.currentTime = performance.now();
        var elapsed = (this.currentTime - this.inicio_tiempo) / 1000; // Convert to seconds
        this.progress = elapsed / this.desiredDuration;
        this.t = this.progress * this.speedfactor;

        // this.t += this.dt;
        if(this.t >= 1)//fin animation
        {
            // this.callback();
            var fin_tiempof = performance.now();
            var milisegundosf = (fin_tiempof - this.inicio_tiempo);
            console.info("TIEMPO FINAL spLine=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : "+ milisegundosf );
            this.detener_animacion_correr_cuy();
        }
    }

    correr_cuy2() {
        // Adjust the desired duration (in seconds)        
        // Calculate the frame rate and time step
        // this.frameRate = 60; // Frames per second (adjust as needed)

        this.animacion_correr_cuy = requestAnimationFrame(this.correr_cuy2.bind(this));// Keep the context of 'this'        
        var pt = this.spline.getPoint( this.t );
        
        this.cuy.model.position.set( pt.x, pt.y, pt.z );
        this.cuy.mixer.update(this.cuy.clock.getDelta())
        
        var tangent = this.spline.getTangent( this.t ).normalize();
        this.axis.crossVectors(this.up, tangent).normalize();
        var radians = Math.acos( this.up.dot( tangent ) );
        this.cuy.model.quaternion.setFromAxisAngle( this.axis, radians );
        // this.t += this.dt;
        this.t += this.dt;//1 / this.numFrames; 
        if(this.t >= 1)//fin animation
        {
            // this.callback();

            var fin_tiempof = performance.now();
            var milisegundosf = (fin_tiempof - this.inicio_tiempo);
            console.info("TIEMPO FINAL spLine=> segundos: " +parseFloat(milisegundosf/1000).toFixed(2)+" ,  milliseconds : "+ milisegundosf );
            this.detener_animacion_correr_cuy();
        }
    }
    mostrar_cuymoviendo(){
        if( this.cuy.model.visible == false)
        {
            this.cuy.model.visible = true; 
    
            this.cuy.modelCajaGirando.visible = false;
            this.cuy.modelCuyDudando.visible = false;
            this.cuy.modelCuyChoque.visible = false;
        }
    }
    cuydudando() {

        var position = {   x: this.cuy.model.position.x,
                y: this.cuy.model.position.y,
                z: this.cuy.model.position.z 
        };   //////nueva posicion
        this.cuy.modelCuyDudando.position.set(position.x , position.y , position.z);
        this.cuy.mixerCuyDudando.update(this.cuy.clockCuyDudando.getDelta());
        this.animacion_cuydudando = requestAnimationFrame(this.cuydudando.bind(this));
        this.cuy.modelCuyDudando.visible = true;

        this.cuy.model.visible = false;
        this.cuy.modelCuyChoque.visible = false;

        this.cuy.renderer.render(this.cuy.scene, this.cuy.camera);
    }
    puntos_azar(desde){
        var arrayvector = [];
        arrayvector.push(new THREE.Vector3(desde.x,0,desde.z));
        for(var a = 0 ; a < parseInt(this.spline_control_points) ; a++ ){
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
    detener_animacion_cuydudando(){
        if(typeof this.animacion_cuydudando != "undefined"){
             cancelAnimationFrame(this.animacion_cuydudando);
             delete this.animacion_cuydudando;
        }
    }
    generar_nueva_posicion_random(){
        this.bfuncion_easing_indice = 0;//random_entero(0,EasingFunctions_array.length-1);
        //console.warn("i= "+bfuncion_easing_indice);
        this.b = PUNTOS_CUY[INDICE_PUNTOS_CUY];
        INDICE_PUNTOS_CUY++;
        if(INDICE_PUNTOS_CUY > PUNTOS_CUY.length){
            console.warn(INDICE_PUNTOS_CUY+ " ---------Cuy pasó length del array PUNTOS_CUY  --- ")
            INDICE_PUNTOS_CUY = 0; 
            b = PUNTOS_CUY[INDICE_PUNTOS_CUY];
        }
        return b;
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