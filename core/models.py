from django.db import models
from django.utils import timezone
from django.conf import settings
from user.models import User

class Pregunta(models.Model):
    texto = models.CharField(max_length=255)
    
    def __str__(self):
        return self.texto

class Respuesta(models.Model):
    pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE, related_name="respuestas")
    texto = models.CharField(max_length=255)
    es_correcta = models.BooleanField(default=False)
    
    def __str__(self):
        return self.texto

class Intento(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    puntuacion = models.IntegerField()
    aciertos = models.IntegerField()
    fallos = models.IntegerField()

    def __str__(self):
        return f"Intento de {self.usuario} el {self.fecha}"
