from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.hashers import make_password
from .serializers import SignUpSerializer, UserSerializer
from .validators import validate_file_extension

from django.contrib.auth.models import User
from .models import UserProfile
from .utils import check_s3_file_exists

# Create your views here.


@api_view(['POST'])
def register(request):
    data = request.data

    user = SignUpSerializer(data=data)

    if user.is_valid():
        if not User.objects.filter(username=data['email']).exists():
            user = User.objects.create(
                first_name=data['first_name'],
                last_name=data['last_name'],
                username=data['email'],
                email=data['email'],
                password=make_password(data['password'])
            )

            return Response({
                'message': 'User registered.'},
                status=status.HTTP_200_OK
            )
        else:
            return Response({
                'error': 'User already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

    else:
        return Response(user.errors)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def currentUser(request):
    user = request.user

    # Check if the resume exists in S3
    if user.userprofile.resume and not check_s3_file_exists(user.userprofile.resume.name):
        user.userprofile.resume = None
        user.userprofile.save(update_fields=['resume'])

    # Serialize the user data
    user_data = UserSerializer(user)

    return Response(user_data.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request):
    user = request.user

    data = request.data

    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def uploadResume(request):
    user = request.user
    resume = request.FILES['resume']

    if not hasattr(user, 'userprofile'):
        UserProfile.objects.create(user=user)

    if resume == '':
        return Response({'error': 'Please upload your resume.'}, status=status.HTTP_400_BAD_REQUEST)

    isValidFile = validate_file_extension(resume.name)

    if not isValidFile:
        return Response({'error': 'Please upload only pdf file.'}, status=status.HTTP_400_BAD_REQUEST)

    print("🔴", user.userprofile.user.first_name)
    user.userprofile.resume = resume
    user.userprofile.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)
