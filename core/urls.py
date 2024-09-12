from django.urls import path
from .views import home,register,edit_profile,delete_account, jugar, resultado, historial, exit


urlpatterns = [    
    path('',home,name="home"),    
    path('logout/', exit ,name="exit"), 
    path('register/', register, name='register'),
    path('edit-profile/', edit_profile, name='edit_profile'),
    path('delete-account/', delete_account, name='delete_account'),
    path('jugar/', jugar, name='jugar'),
    path('resultado/', resultado, name='resultado'),
    path('historial/', historial, name='historial'),
]
