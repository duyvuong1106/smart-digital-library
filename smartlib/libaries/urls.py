from django.urls import path, include
from rest_framework.routers import DefaultRouter
from libaries import views


r = DefaultRouter()

r.register('categories', views.CategoryViewSet, 'category')
r.register('documents', views.DocumentViewSet, 'document')
r.register('users', views.UserViewSet, 'user')
r.register('payments', views.PaymentViewSet, 'payment')
r.register('statistics', views.StatsViewSet, 'statistic')


urlpatterns = [
    path('', include(r.urls))
]