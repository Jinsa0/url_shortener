from rest_framework.permissions import BasePermission

class IsAnonymous(BasePermission):
    message = "You are already authenticated."

    def has_permission(self, request, view):
        return not request.user.is_authenticated

class IsRequestUser(BasePermission):
    message = "Only owner can enter their account page."

    def has_object_permission(self, request, view, obj):
        return obj == request.user