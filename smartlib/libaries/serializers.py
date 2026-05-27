from rest_framework import serializers


from libaries.models import Category, Document, Tag, Payment, Review, User


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class ItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.image:
            data['image'] = instance.image.url

        return data

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'user', 'document', 'amount', 'method', 'is_success', 'created_date']
        read_only_fields = ['user', 'is_success', 'created_date']

class DocumentSerializer(ItemSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'author', 'image',  'price', 'is_free', 'views', 'category', 'tags']


class DocumentDetailSerializer(DocumentSerializer):
    tags = TagSerializer(many=True)
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = DocumentSerializer.Meta.model
        fields = DocumentSerializer.Meta.fields + ['description', 'file', 'publish_year', 'uploaded_by', 'downloads','review_count']

    def to_representation(self, document):
        data = super().to_representation(document)
        request = self.context.get('request')


        if request and request.user and request.user.is_authenticated:
            data['like'] = document.like_set.filter(user=request.user, active=True).exists()
        else:
            data['like'] = False

        return data

    def get_review_count(self, document):
        return document.review_set.filter(active=True).count()


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'avatar', 'age']

class UserSerializer(SimpleUserSerializer):
    class Meta:
        model = SimpleUserSerializer.Meta.model
        fields = SimpleUserSerializer.Meta.fields + ['username', 'password']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.avatar:
            data['avatar'] = instance.avatar.url
        return data

    def create(self, validated_data):
        user = User(**validated_data)

        user.set_password(user.password)
        user.save()

        return user


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'content', 'rating', 'user', 'document']
        extra_kwargs = {
            'document': {
                'write_only': True
            }
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['user'] = UserSerializer(instance.user, context=self.context).data

        return data


class CategoryStatsSerializer(serializers.ModelSerializer):
    total_documents = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id','name','total_documents']

class DocumentStatsSerializer(serializers.ModelSerializer):
    borrow_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Document
        fields = ['id','title','views','borrow_count']

class DashboardStatsSerializer(serializers.Serializer):
    total_revenue = serializers.FloatField()
    total_documents = serializers.IntegerField()
    total_borrows = serializers.IntegerField()
    category_stats = CategoryStatsSerializer(many=True)
    top_documents = DocumentStatsSerializer(many=True)


