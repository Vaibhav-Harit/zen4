"""
URL configuration for snapit project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def backend_root(request):
    html = """
    <html>
      <head>
        <title>snap.it Neural API</title>
        <style>
          body { 
            background-color: #060914; 
            color: #22D3EE; 
            font-family: monospace; 
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
            margin: 0;
            background-image: radial-gradient(circle at 50% 50%, #101B3F 0%, #060914 80%);
          }
          .title { font-size: 3rem; font-weight: bold; background: linear-gradient(to right, #38BDF8, #A855F7); -webkit-background-clip: text; color: transparent; margin-bottom: 0.5rem; }
          .subtitle { color: #A6B3DE; font-size: 1.2rem; }
          a { color: #38BDF8; text-decoration: none; margin-top: 2rem; border: 1px solid #38BDF8; padding: 10px 20px; border-radius: 5px; transition: 0.3s; }
          a:hover { background: #38BDF8; color: #060914; box-shadow: 0 0 15px #38BDF8; }
        </style>
      </head>
      <body>
        <div class="title">snap.it // Neural Core</div>
        <div class="subtitle">API Services are Online and Processing.</div>
        <a href="/admin/">Enter Matrix Admin Panel</a>
      </body>
    </html>
    """
    return HttpResponse(html)

urlpatterns = [
    path('', backend_root),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
