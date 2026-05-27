from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.IntegerChoices):
    ADMIN = 1 , "Admin"
    READER = 2, "Reader"
    LIBRARIAN = 3, "Librarian"

class PaymentMethod(models.TextChoices):
    CASH = "CASH", "Cash"
    PAYPAL = "PAYPAL", "Paypal"
    STRIPE = "STRIPE", "Stripe"

class DocumentStatus(models.TextChoices):
    BORROWING = "BORROWING", "Borrowing"
    RETURNED = "RETURNED", "Returned"
    OVERDUE = "OVERDUE", "Overdue"


class User(AbstractUser):
    age = models.IntegerField(null=True, blank=True)
    role = models.IntegerField(choices=UserRole.choices, default=UserRole.READER)
    avatar = CloudinaryField(null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Category(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Document(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField(null=True)
    author = models.CharField(max_length=100, null=False)
    publish_year = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    image = CloudinaryField(null=True)
    file = CloudinaryField(resource_type="auto")
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_free = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    downloads = models.IntegerField(default=0)
    tags = models.ManyToManyField('Tag', blank=True)

    class Meta:
        unique_together = ('title', 'category')


    def __str__(self):
        return self.title

class BorrowDocument(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    borrow_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=DocumentStatus.choices, default=DocumentStatus.BORROWING)

    class Meta:
        unique_together = ('user', 'document', 'borrow_date')

class DocumentView(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)


class Tag(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Iteration(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)

    class Meta:
        abstract = True

class Review(Iteration):
    content = models.TextField()
    rating = models.IntegerField(default=5)
    class Meta:
        unique_together = ('user', 'document')

    def __str__(self):
        return self.content

class Like(Iteration):
    class Meta:
        unique_together = ('document', 'user')


class Payment(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    method = models.CharField(max_length=20, choices=PaymentMethod.choices)
    is_success = models.BooleanField(default=False)








