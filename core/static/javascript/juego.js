document.addEventListener("DOMContentLoaded", function() {
    const palabra = document.getElementById("palabra").getAttribute("data-palabra").toLowerCase();
    const palabraElemento = document.getElementById("palabra-respuesta");
    const palabraIntento = document.getElementById("palabra-completa");
    const intentosElemento = document.getElementById("intentos");
    const mensaje = document.getElementById("mensaje");
    const adivinarBtn = document.getElementById("adivinar");
    const teclas = document.querySelectorAll(".key");
    const btnVolver = document.getElementById("btnVolver");
    const btnPista = document.getElementById("btnPista"); 
    const txtPista = document.getElementById("palabra");         

    let intentos = 7;
    let palabraAdivinada = new Array(palabra.length).fill("_");
        
    palabraElemento.textContent = palabraAdivinada.join(" ");
    
    function actualizarPalabraAdivinada() {
        palabraElemento.textContent = palabraAdivinada.join(" ");
    }

    function visualizarBoton(){
        btnVolver.removeAttribute("hidden");
        btnVolver.setAttribute("data-class", intentos.toString());
    }
    function deshabilitarCuadro(){
        adivinarBtn.setAttribute("hidden",true);
        palabraIntento.setAttribute("hidden",true);
        palabraIntento.disabled = true;
    }

    function verificarGanador() {
        if (!palabraAdivinada.includes("_")) {
            mensaje.textContent = "¡Ganaste! La palabra era '" + palabra + "'.";
            deshabilitarTeclas();
            deshabilitarCuadro();
            visualizarBoton();
            document.getElementById("attemps").setAttribute("value",(intentos));            
            document.getElementById("is_correct").setAttribute("value",1);
        }
    }
    function nombrarGanador() {        
        mensaje.textContent = "¡Ganaste! La palabra era '" + palabra + "'.";            
        deshabilitarCuadro();
        deshabilitarTeclas();
        visualizarBoton();
        document.getElementById("attemps").setAttribute("value",(intentos));            
        document.getElementById("is_correct").setAttribute("value",1);
    }

    function verificarPerdedor() {
        if (intentos === 0) {
            mensaje.textContent = "Perdiste. La palabra era '" + palabra + "'.";
            deshabilitarTeclas();
            visualizarBoton();
            document.getElementById("attemps").setAttribute("value", 7);            
            document.getElementById("is_correct").setAttribute("value", 0);            
            deshabilitarCuadro();
            dibujarMuneco();
        }
    }

    function deshabilitarTeclas() {
        teclas.forEach(tecla => {
            tecla.disabled = true;
        });
    }

    teclas.forEach(tecla => {
        tecla.addEventListener("click", function() {
            const letra = this.textContent.toLowerCase();
            if (palabra.includes(letra)) {
                for (let i = 0; i < palabra.length; i++) {
                    if (palabra[i] === letra) {
                        palabraAdivinada[i] = letra;
                    }
                }
                actualizarPalabraAdivinada();
                verificarGanador();
                this.disabled = true; // Deshabilitar la tecla seleccionada
            } else {
                intentos--;
                intentosElemento.textContent = intentos;
                verificarPerdedor();
                dibujarMuneco();
                this.disabled = true; // Deshabilitar la tecla seleccionada
            }
        });
    });

    btnPista.addEventListener("click", function() {
        txtPista.removeAttribute("hidden");
        btnPista.setAttribute("hidden", "true");
    });
    
    adivinarBtn.addEventListener("click", function() {
        validar();
    });

    palabraIntento.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
          e.preventDefault();    
          validar();                
        }
      });

    function validar(){
        const palabraSuposicion = palabraIntento.value.toLowerCase();        
            if (palabra == palabraSuposicion) {                
                // Actualizar la palabra adivinada con la letra correcta en las posiciones correspondientes
                palabraAdivinada = palabraSuposicion.split("")
                palabraElemento.textContent = palabraAdivinada.join(" ");                
                nombrarGanador();
            } else {
                intentos--;
                intentosElemento.textContent = intentos;
                if (intentos === 0) {
                    mensaje.textContent = "Perdiste. La palabra era '" + respuesta + "'.";
                    deshabilitarCuadro();
                    dibujarMuneco();
                    verificarPerdedor();
                } else {
                    mensaje.textContent = "Palabra incorrecta. Intenta de nuevo.";
                    dibujarMuneco();
                }
                palabraIntento.value = ""; // Limpiar el campo de entrada
            }                
    }

    

    function dibujarMuneco(){
        var canvas = document.getElementById("lienzo");
        if (canvas.getContext){
            var ctx = canvas.getContext("2d");

            switch (intentos) {
                case 6:
                    ctx.beginPath();
                    ctx.moveTo(30,200);
                    ctx.lineTo(30,5);
                    ctx.lineTo(150,5);
                    ctx.lineTo(150,20);
                    ctx.stroke();
                    break;
                case 5:
                    ctx.beginPath();
                    ctx.arc(150, 40 , 20, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                case 4:
                    ctx.beginPath();
                    ctx.moveTo(150,60);
                    ctx.lineTo(150,100);
                    ctx.stroke();
                    break;
                case 3:
                    ctx.beginPath();
                    ctx.moveTo(150,60);
                    ctx.lineTo(130,100);
                    ctx.stroke();
                    break;
                case 2:
                    ctx.beginPath();
                    ctx.moveTo(150,60);
                    ctx.lineTo(170,100);
                    ctx.stroke();
                    break;
                case 1:
                    ctx.beginPath();
                    ctx.moveTo(150,100);
                    ctx.lineTo(130,130);
                    ctx.stroke();
                    break;
                case 0:
                    ctx.beginPath();
                    ctx.moveTo(150,100);
                    ctx.lineTo(170,130);
                    ctx.stroke();
                    break;
                default:
                  console.log("Fin del juego");
              }                       
        }
    }
});
