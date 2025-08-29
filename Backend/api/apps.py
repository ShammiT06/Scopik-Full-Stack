from django.apps import AppConfig
import sys

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'  # This is important: It must match your app's folder name

    def ready(self):
        if 'runserver' in sys.argv or 'runworker' in sys.argv:
            from django.core.signals import request_started
            from .scheduler import start_scheduler

            def start_scheduler_once(sender, **kwargs):
                start_scheduler()
                request_started.disconnect(start_scheduler_once)

            request_started.connect(start_scheduler_once)