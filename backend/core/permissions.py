from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Permission to only allow admins"""
    
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'ADMIN'
        )


class IsAdminOrReadOnly(permissions.BasePermission):
    """Permission to allow reading for everyone, writing for admins only"""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'ADMIN'
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """Permission to allow owner or admin to modify"""
    
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'ADMIN':
            return True
        
        # Check if object has author or user field
        if hasattr(obj, 'author'):
            return obj.author == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False


class IsMemberOrAdmin(permissions.BasePermission):
    """Permission for paid members (MEMBER/ADMIN with active subscription)"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.role == 'ADMIN':
            return True
        
        # Check subscription
        try:
            subscription = request.user.subscription
            return (
                subscription.tier != 'FREE' and 
                subscription.status == 'ACTIVE'
            )
        except:
            return False
