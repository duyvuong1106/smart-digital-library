import stripe
from django.db.models import Q
from django.db.models.aggregates import Sum, Count
from rest_framework import viewsets, filters, generics, status, parsers, permissions
from rest_framework.response import Response
from libaries.models import Document, Category, Tag, User, Payment, BorrowDocument, DocumentStatus, UserRole, Review
from libaries import serializers, paginators, perms
from rest_framework.decorators import action

from smartlib import settings


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all().order_by('id')
    serializer_class = serializers.CategorySerializer


class DocumentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView, generics.CreateAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Document.objects.prefetch_related('tags').filter(active=True)
    serializer_class = serializers.DocumentSerializer
    pagination_class = paginators.ItemPaginator
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'author', 'publish_year', 'category__name']
    ordering_fields = ['id', 'title', 'publish_year', 'views', 'downloads']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return serializers.DocumentDetailSerializer
        return serializers.DocumentSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [perms.IsAdmin | perms.IsApprovedLibrarian]
        elif self.action == 'retrieve':
            return [perms.HasAccessDocument]

        return [permissions.AllowAny]


    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

    @action(methods=['GET'], detail=False, url_path='compare')
    def compare(self, request):
        ids = request.query_params.get('ids','').split(',')

        try:
            arr_id = []
            for x in ids:
                if x.strip() != '':
                    arr_id.append(int(x))
        except ValueError:
            return Response({'error':'Danh sách ID không hợp lệ'}, status=status.HTTP_400_BAD_REQUEST)
        docs = Document.objects.filter(id__in=arr_id, active=True)
        serializer = serializers.DocumentSerializer(docs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['POST'], detail=True, url_path='borrow', permission_classes=[permissions.IsAuthenticated])
    def borrow(self, request, pk):
        document = self.get_object()
        if not document.is_free:
            has_paid = Payment.objects.filter(user=request.user, document=document, is_success=True).exists()
            if not has_paid:
                return Response({'error':'Bạn chưa thanh toán tài liệu này'}, status=status.HTTP_402_PAYMENT_REQUIRED)


        borrow = BorrowDocument.objects.create(
            user=request.user,
            document=document,
            status=DocumentStatus.BORROWING
        )

        return Response({'msg': 'MƯỢN THÀNH CÔNG!!!'}, status=status.HTTP_201_CREATED)

    @action(methods=['GET'], detail=True, url_path='reviews')
    def get_reviews(self, request, pk):
        document = self.get_object()
        reviews = Review.objects.filter(document=document, active=True).order_by('-id')

        paginator = paginators.ReviewPaginator()
        page = paginator.paginate_queryset(reviews, request)
        if page is not None:
            serializer = serializers.ReviewSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = serializers.ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    @action(methods=['POST'], detail=True, url_path='add-review', permission_classes=[permissions.IsAuthenticated])
    def add_review(self, request, pk):
        document = self.get_object()
        content = request.data.get('content')
        rating = request.data.get('rating', 5)

        if not content or not content.strip():
            return Response({'error': 'Nội dung nhận xét đánh giá không được để trống!'},
                            status=status.HTTP_400_BAD_REQUEST)

        review = Review.objects.create(
            user=request.user,
            document=document,
            content=content.strip(),
            rating=int(rating)
        )

        serializer = serializers.ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        query = Document.objects.prefetch_related('tags').filter(active=True)
        q = self.request.query_params.get('q')

        if q:
            query = query.filter(title__icontains=q)

        return query


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]

    @action(methods=['GET', 'PATCH'], url_path='current-user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def current_user(self, request):
        u = request.user
        if request.method == "PATCH":
            s = serializers.UserSerializer(u, data=request.data, partial=True)
            s.is_valid(raise_exception=True)
            u = s.save()

        return Response(serializers.UserSerializer(u).data, status=status.HTTP_200_OK)

    @action(methods=['PATCH'], detail=True, url_path='approve', permission_classes=[perms.IsAdmin])
    def approve_librarian(self, request, pk):
        user = self.get_object()
        if user.role == UserRole.LIBRARIAN:
            user.is_approved = True
            user.save()
            return Response({'msg': 'DUYỆT THỦ THƯ THÀNH CÔNG!!!'}, status=status.HTTP_200_OK)
        return Response({'error': 'NGƯỜI DÙNG KHÔNG PHẢI THỦ THƯ!!!'}, status=status.HTTP_400_BAD_REQUEST)


class PaymentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView, generics.CreateAPIView):
    serializer_class = serializers.PaymentSerializer

    def get_permissions(self):
        if self.action == 'stripe_webhook':
            return [permissions.AllowAny]
        return [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.action == 'stripe_webhook':
            return Payment.objects.all().select_related('user','document')
        return Payment.objects.filter(user=self.request.user).select_related('user','document').order_by('-created_date')

    def create(self, request, *args, **kwargs):
        doc_id = request.data.get('id')
        method = request.data.get('method', 'STRIPE').upper()

        try:
            document = Document.objects.get(id=doc_id, active=True)
        except Document.DoesNotExist:
            return Response({"error":"Tài liệu không tồn tại"},status=status.HTTP_404_NOT_FOUND)

        if method == 'CASH':
            payment_wait = Payment.objects.create(user=request.user, document=document, amount=document.price, method='CASH', is_success=False)
            return Response({'msg':'Đăng ký thành công. Vui lòng đến thư viện để thanh toán trực tiếp', 'payment_id':payment_wait.id}, status=status.HTTP_201_CREATED)

        payment_wait = Payment.objects.create(user=request.user, document=document, amount=document.price, method='STRIPE', is_success=False)
        stripe.api_key = settings.STRIPE_SECRET_KEY

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'vnd',
                            'unit_amount': int(round(document.price)),
                            'product_data': {
                                'name': document.title,
                            },
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url=settings.PAYMENT_SUCCESS_URL,
                cancel_url=settings.PAYMENT_CANCEL_URL,
                client_reference_id=str(payment_wait.id),
            )

            return Response({'payment_url': checkout_session.url, 'payment_id': payment_wait.id}, status=status.HTTP_201_CREATED)
        except Exception as ex:
            return Response({'error': str(ex)}, status=status.HTTP_400_BAD_REQUEST)


    @action(methods=['POST'], detail=False, url_path='webhook')
    def stripe_webhook(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        event = None

        stripe.api_key = settings.STRIPE_SECRET_KEY

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            payment_id = session.get('client_reference_id')

            if payment_id:
                try:
                    payment = Payment.objects.get(id=payment_id)
                    payment.is_success = True
                    payment.save()
                except Payment.DoesNotExist:
                    pass

        return Response(status=status.HTTP_200_OK)


class ReviewViewSet(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = Review.objects.filter(active=True)
    serializer_class = serializers.ReviewSerializer
    permission_classes = [perms.CommentOwner]


class StatsViewSet(viewsets.ViewSet):
    permission_classes = [perms.IsAdmin | perms.IsApprovedLibrarian]

    @action(methods=['GET'], detail=False, url_path='stats')
    def get_stats(self, request):
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        quarter = request.query_params.get('quarter')

        payments_query = Payment.objects.filter(is_success=True).order_by('-created_date')
        borrows_query = BorrowDocument.objects.all()

        borrow_filter={}

        if year:
            payments_query = payments_query.filter(created_date__year=year)
            borrows_query = borrows_query.filter(created_date__year=year)
            borrow_filter['borrowdocument__created_date__year'] = year
        if month:
            payments_query = payments_query.filter(created_date__month=month)
            borrows_query = borrows_query.filter(created_date__month=month)
            borrow_filter['borrowdocument__created_date__month'] = month
        elif quarter:
            quarter_months = {
                '1': [1, 2, 3],
                '2': [4, 5, 6],
                '3': [7, 8, 9],
                '4': [10, 11, 12]
            }.get(str(quarter), [])
            if quarter_months:
                payments_query = payments_query.filter(created_date__month__in=quarter_months)
                borrows_query = borrows_query.filter(created_date__month__in=quarter_months)
                borrow_filter['borrowdocument__created_date__month__in'] = quarter_months


        revenue = payments_query.aggregate(total=Sum('amount'))
        if revenue['total'] is not None:
            total_revenue = revenue['total']
        else:
            total_revenue = 0.0

        total_documents = Document.objects.filter(active=True).count()
        total_borrows =borrows_query.count()

        categories_queryset = (Category.objects.filter(active=True)
                               .annotate(total_documents=Count('document')).order_by('-total_documents'))

        documents_queryset = (Document.objects.filter(active=True)
                    .annotate(borrow_count=Count('borrowdocument', filter=Q(**borrow_filter)))
                    .order_by('-views', '-borrow_count')[:5])


        dashbroad_data = {
            'total_revenue': total_revenue,
            'total_documents': total_documents,
            'total_borrows': total_borrows,
            'category_stats': categories_queryset,
            'top_documents': documents_queryset
        }

        serializer=serializers.DashboardStatsSerializer(dashbroad_data)

        return Response(serializer.data, status=status.HTTP_200_OK)


