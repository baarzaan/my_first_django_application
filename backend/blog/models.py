from django.db import models
import uuid
from django.conf import settings

# Create your models here.
class BasicModels(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']

class Blog(BasicModels):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=300)
    body = models.TextField()
    image = models.ImageField(upload_to="blogs/", null=True, blank=True)

    def __str__(self):
        return self.title

class Comment(BasicModels):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
    body = models.TextField()
    image = models.ImageField("comments/", null=True, blank=True)

    def __str__(self):
        return self.body[0:50]

class Like(BasicModels):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'blog')