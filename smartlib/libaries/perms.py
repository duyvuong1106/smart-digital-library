from rest_framework import permissions

class IsAuthenticatedIfPaidDocument(permissions.BasePermission):
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        if obj.is_free:
            return bool(request.user and request.user.is_authenticated)
        return True


