from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore
from .enrollment import enroll_students_function

scheduler = BackgroundScheduler()
scheduler_started = False  # Global flag to avoid multiple initializations

def start_scheduler():
    global scheduler_started
    if scheduler_started:
        return  # Avoid adding job store or jobs multiple times

    scheduler.add_jobstore(DjangoJobStore(), "default")

    scheduler.add_job(
        enroll_students_function,
        "interval",
        hours=12,
        name="Periodic student enrollment",
        replace_existing=True,
    )
    scheduler.start()
    scheduler_started = True