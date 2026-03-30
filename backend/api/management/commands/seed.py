from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Project, ErrorSnap, UserProfile

class Command(BaseCommand):
    help = 'Seeds the database with realistic demo data for the Snap.it Dashboard'

    def handle(self, *args, **kwargs):
        # 1. Get or create the first user
        user = User.objects.first()
        if not user:
            user = User.objects.create_user(username='demo_user', email='demo@example.com', password='password123')
            UserProfile.objects.get_or_create(user=user, github_id='12345678')
            self.stdout.write(self.style.SUCCESS('Created demo_user'))

        # 2. Fake Project Data
        projects_data = [
            {
                "name": "E-Commerce Core",
                "repo_full_name": "snapit-demo/ecommerce-backend",
                "repo_id": "repo_001",
                "html_url": "https://github.com/snapit-demo/ecommerce-backend"
            },
            {
                "name": "React Checkout UI",
                "repo_full_name": "snapit-demo/checkout-ui",
                "repo_id": "repo_002",
                "html_url": "https://github.com/snapit-demo/checkout-ui"
            },
            {
                "name": "Auth Microservice",
                "repo_full_name": "snapit-demo/auth-service",
                "repo_id": "repo_003",
                "html_url": "https://github.com/snapit-demo/auth-service"
            },
            {
                "name": "Mobile API Gateway",
                "repo_full_name": "snapit-demo/mobile-gateway",
                "repo_id": "repo_004",
                "html_url": "https://github.com/snapit-demo/mobile-gateway"
            }
        ]

        # 3. Realistic Error Snap Data
        errors_pool = [
            {
                "error": "ReferenceError: process is not defined",
                "code": "const apiKey = process.env.API_KEY;",
                "fix": "Ensure you are using a bundler that supports process.env or define it in your vite.config.js.",
                "explanation": "Attempted to access Node.js globals in a browser environment."
            },
            {
                "error": "django.db.utils.IntegrityError: NOT NULL constraint failed: api_project.user_id",
                "code": "project = Project.objects.create(name='New')",
                "fix": "project = Project.objects.create(name='New', user=request.user)",
                "explanation": "Missing required foreign key 'user' during model instantiation."
            },
            {
                "error": "TypeError: Cannot read properties of undefined (reading 'map')",
                "code": "items.map(item => <li>{item}</li>)",
                "fix": "items?.map(item => <li>{item}</li>) || <p>Loading...</p>",
                "explanation": "Component tried to render a list before data was fetched from the API."
            }
        ]

        # 4. Seeding Logic
        for p_data in projects_data:
            project, created = Project.objects.get_or_create(
                repo_id=p_data["repo_id"],
                defaults={
                    "user": user,
                    "name": p_data["name"],
                    "repo_full_name": p_data["repo_full_name"],
                    "html_url": p_data["html_url"]
                }
            )
            
            if created:
                self.stdout.write(f'Created project: {project.name}')
            
            # Add 3 snaps to each project
            for err in errors_pool:
                ErrorSnap.objects.get_or_create(
                    project=project,
                    error_text=err["error"],
                    defaults={
                        "code_snippet": err["code"],
                        "ai_explanation": err["explanation"],
                        "ai_fixed_code": err["fix"]
                    }
                )
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded Dashboard with demo data!'))
