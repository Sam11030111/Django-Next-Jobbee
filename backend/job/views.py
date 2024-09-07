from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializer import JobSerializer
from .models import Job

# Create your views here.


@api_view(['GET'])
def getAllJobs(request):
    jobs = Job.objects.all()
    serilaizer = JobSerializer(jobs, many=True)

    return Response(serilaizer.data)
