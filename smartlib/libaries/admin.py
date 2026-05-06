from django.contrib import admin
from django.utils.safestring import mark_safe
from libaries.models import Category, Document, Tag, Review, Payment


class MyDocumentAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'active', 'created_date']
    search_fields = ['title']
    list_filter = ['id', 'title', 'created_date']
    readonly_fields = ['image_view']

    def image_view(self, libary):
        if libary.image:
            return mark_safe(f'<img src="{libary.image.url}" width="200" />')
        return None

class MyAdminSite(admin.AdminSite):
    site_header = 'Smart Libary'


admin_site = MyAdminSite(name='smartlib')


admin_site.register(Category)
admin_site.register(Document, MyDocumentAdmin)
admin_site.register(Tag)
admin_site.register(Review)
admin_site.register(Payment)
