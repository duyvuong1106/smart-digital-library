from rest_framework import permissions
from libaries.models import Payment, User
from libaries.models import UserRole


class HasAccessDocument(permissions.BasePermission):
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        if obj.is_free:
            return True

        if not (request.user and request.user.is_authenticated):
            return False

        if ((request.user.role == UserRole.LIBRARIAN and request.user.is_approved)
                or request.user.role == UserRole.ADMIN
                or obj.uploaded_by == request.user
                or request.user.is_superuser or request.user.is_staff):
            return True

        return Payment.objects.filter(user=request.user, document=obj, is_success=True).exists()




class IsApprovedLibrarian(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == UserRole.LIBRARIAN and
            request.user.is_approved
        )


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and
            (request.user.role == UserRole.ADMIN or request.user.is_superuser or request.user.is_staff)
        )

class CommentOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, comment):
        return super().has_permission(request, view) and request.user == comment.user



