from django.contrib import admin
from .models import Job, CandidateApplied

# Register your models here.
admin.site.register(Job)
admin.site.register(CandidateApplied)
