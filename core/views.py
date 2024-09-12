from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout, authenticate, login
from .forms import CustomUserCreationForm,  EditProfileForm
from .models import Pregunta, Respuesta, Intento
import random


def home(request):
    return render(request,"home.html")


def exit(request):
    logout(request)
    return redirect(home)

def register(request):
    data = {
        'form': CustomUserCreationForm()
    }

    if request.method == 'POST':
        user_creation_form = CustomUserCreationForm(request.POST, request.FILES)

        if user_creation_form.is_valid():
            user_creation_form.save()

            user = authenticate(username=user_creation_form.cleaned_data['username'], password=user_creation_form.cleaned_data['password1'])
            login(request, user)
            return redirect('home')
        else:
            data['form'] = user_creation_form

    return render(request, 'registration/register.html', data)


@login_required
def edit_profile(request):
    user = request.user

    if request.method == 'POST':
        form = EditProfileForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            return redirect('home')  # Redirige al inicio o a la página de perfil
    else:
        form = EditProfileForm(instance=user)

    return render(request, 'registration/edit_profile.html', {'form': form})


@login_required
def delete_account(request):
    user = request.user

    if request.method == 'POST':
        user.delete()
        return redirect('home')  # Redirige al inicio después de eliminar la cuenta

    return render(request, 'registration/delete_profile.html')


@login_required
def jugar(request):
    # Carga las diferentes preguntas, en este caso 5 despues de abrir el juego
    if 'preguntas' not in request.session:
        preguntas = random.sample(list(Pregunta.objects.all()), 5)
        request.session['preguntas'] = [pregunta.id for pregunta in preguntas]
        request.session['indice_pregunta'] = 0
        request.session['respuestas'] = []
    
    # obtiene el indice de la pregunta
    indice_pregunta = request.session['indice_pregunta']
    if indice_pregunta >= len(request.session['preguntas']):
        return redirect('resultado')

    pregunta_id = request.session['preguntas'][indice_pregunta]
    pregunta = Pregunta.objects.get(id=pregunta_id)
    
    if request.method == 'POST':
        # Procesa la respuesta seleccionada y guardarla en la sesión
        respuesta_seleccionada = request.POST.get('respuesta')
        if respuesta_seleccionada:
            request.session['respuestas'].append(respuesta_seleccionada)
        request.session['indice_pregunta'] += 1
        
        # Si ya se respondieron todas las preguntas, manda a la pantalla de resultado
        if request.session['indice_pregunta'] >= len(request.session['preguntas']):
            return redirect('resultado')
        else:
            # si no termina, carga la siguiente pregunta
            pregunta_id = request.session['preguntas'][request.session['indice_pregunta']]
            pregunta = Pregunta.objects.get(id=pregunta_id)
    
    return render(request, 'game/jugar.html', {'pregunta': pregunta})

def resultado(request):
    # Procesa las respuestas almacenadas en la sesión
    respuestas_usuario = request.session.get('respuestas', [])
    preguntas_ids = request.session.get('preguntas', [])
    
    aciertos = 0
    fallos = 0
    
    for i, pregunta_id in enumerate(preguntas_ids):
        pregunta = Pregunta.objects.get(id=pregunta_id)
        respuesta_correcta = pregunta.respuestas.filter(es_correcta=True).first()
        
        # Verifica si la respuesta es correcta o no
        if str(respuesta_correcta.id) == respuestas_usuario[i]:
            aciertos += 1
        else:
            fallos += 1
    
    puntuacion = aciertos * 10  # Se le da un valor de puntaje de 10 si  se responde correctamente
    
    # Guardamos el intento en la base de datos
    intento = Intento.objects.create(
        usuario=request.user,
        puntuacion=puntuacion,
        aciertos=aciertos,
        fallos=fallos
    )
    
    # Se limpia la sesión para poder jugar nuevamente
    request.session.pop('preguntas', None)
    request.session.pop('indice_pregunta', None)
    request.session.pop('respuestas', None)
    
    return render(request, 'game/resultado.html', {'intento': intento})

@login_required
def historial(request):    
    intentos = Intento.objects.filter(usuario=request.user)
    data = {
        'intentos': intentos
    }
    return render(request, 'game/historial.html', data)
