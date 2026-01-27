from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardPagination(PageNumberPagination):
    """Standard pagination matching the Next.js API format"""
    
    page_size = 10
    page_size_query_param = 'pageSize'
    max_page_size = 100
    page_query_param = 'page'
    
    def get_paginated_response(self, data):
        return Response({
            'items': data,
            'total': self.page.paginator.count,
            'page': self.page.number,
            'pageSize': self.page_size,
            'totalPages': self.page.paginator.num_pages,
        })


class BlogPagination(PageNumberPagination):
    """Blog pagination with different defaults"""
    
    page_size = 9
    page_size_query_param = 'limit'
    max_page_size = 50
    page_query_param = 'page'
    
    def get_paginated_response(self, data):
        return Response({
            'posts': data,
            'total': self.page.paginator.count,
            'pages': self.page.paginator.num_pages,
            'currentPage': self.page.number,
        })
