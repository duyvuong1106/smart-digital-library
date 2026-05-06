import stripe
from rest_framework import viewsets, filters, generics, status, parsers, permissions
from rest_framework.response import Response
from libaries.models import Document, Category, Tag, User, Payment
from libaries import serializers, paginators, perms
from rest_framework.decorators import action

from smartlib import settings


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all().order_by('id')
    serializer_class = serializers.CategorySerializer
    # pagination_class = paginators.CategoryPaginator





class DocumentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Document.objects.prefetch_related('tags').filter(active=True)
    serializer_class = serializers.DocumentSerializer
    pagination_class = paginators.ItemPaginator
    permission_classes = [perms.IsAuthenticatedIfPaidDocument]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title']
    ordering_fields = ['id']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return serializers.DocumentDetailSerializer
        return serializers.DocumentSerializer

    def get_queryset(self):
        query = self.queryset
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
        if request.method.__eq__('PATCH'):
            s = serializers.UserSerializer(u, data=request.data)
            s.is_valid(raise_exception=True)
            u=s.save()

            return Response(serializers.UserSerializer(u).data, status=status.HTTP_200_OK)


class PaymentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView, generics.CreateAPIView):
    serializer_class = serializers.PaymentSerializer

    def get_permissions(self):
        if self.action == 'stripe_webhook':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if self.action == 'stripe_webhook':
            return Payment.objects.all()
        return Payment.objects.filter(user=self.request.user).order_by('-created_date')

    def create(self, request, *args, **kwargs):
        doc_id = request.data.get('id')
        try:
            document = Document.objects.get(id=doc_id)
        except Document.DoesNotExist:
            return Response({"error":"Tài liệu không tồn tại"},status=status.HTTP_404_NOT_FOUND)

        payment_wait = Payment.objects.create(user=request.user, document=document, amount=document.price, method='Stripe', is_success=False)
        stripe.api_key = settings.STRIPE_SECRET_KEY

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'vnd',
                            'unit_amount': int(document.price),
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

        # Xử lý khi thanh toán thành công
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
