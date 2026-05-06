from rest_framework import pagination


class ItemPaginator(pagination.PageNumberPagination):
    page_size = 20

class CategoryPaginator(pagination.PageNumberPagination):
    page_size = 5

class ReviewPaginator(pagination.PageNumberPagination):
    page_size = 7

