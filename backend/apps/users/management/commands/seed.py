"""
Seed command for initial database population.

Usage:
    python manage.py seed
    python manage.py seed --admin-only
    python manage.py seed --clear
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from apps.users.models import User
from apps.subscriptions.models import Subscription
from apps.blog.models import Post, Tag


class Command(BaseCommand):
    help = 'Seed the database with initial data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--admin-only',
            action='store_true',
            help='Only create admin user',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            User.objects.all().delete()
            Tag.objects.all().delete()
            Post.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Data cleared'))

        # Create admin user
        admin_email = 'admin@ymit.kz'
        if not User.objects.filter(email=admin_email).exists():
            admin = User.objects.create(
                email=admin_email,
                first_name='Admin',
                last_name='YMIT',
                password=make_password('Admin123!'),
                role=User.Role.ADMIN,
                status=User.Status.ACTIVE,
                email_verified=timezone.now(),
            )
            Subscription.objects.create(
                user=admin,
                tier=Subscription.Tier.PREMIUM,
                status=Subscription.Status.ACTIVE,
            )
            self.stdout.write(self.style.SUCCESS(f'Created admin: {admin_email} / Admin123!'))
        else:
            self.stdout.write(f'Admin {admin_email} already exists')

        if options['admin_only']:
            return

        # Create test users
        test_users = [
            {
                'email': 'member@ymit.kz',
                'first_name': 'Member',
                'last_name': 'User',
                'role': User.Role.MEMBER,
                'tier': Subscription.Tier.STANDARD,
            },
            {
                'email': 'student@ymit.kz',
                'first_name': 'Student',
                'last_name': 'User',
                'role': User.Role.USER,
                'tier': Subscription.Tier.FREE,
            },
            {
                'email': 'new@ymit.kz',
                'first_name': 'New',
                'last_name': 'User',
                'role': User.Role.USER,
                'tier': Subscription.Tier.FREE,
                'status': User.Status.NEW,
                'verified': False,
            },
        ]

        for user_data in test_users:
            email = user_data['email']
            if not User.objects.filter(email=email).exists():
                user = User.objects.create(
                    email=email,
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name'],
                    password=make_password('Test123!'),
                    role=user_data['role'],
                    status=user_data.get('status', User.Status.ACTIVE),
                    email_verified=None if not user_data.get('verified', True) else timezone.now(),
                )
                Subscription.objects.create(
                    user=user,
                    tier=user_data['tier'],
                    status=Subscription.Status.ACTIVE,
                )
                self.stdout.write(self.style.SUCCESS(f'Created user: {email} / Test123!'))
            else:
                self.stdout.write(f'User {email} already exists')

        # Create blog tags
        tags_data = [
            {'name': 'Новости', 'slug': 'news'},
            {'name': 'Образование', 'slug': 'education'},
            {'name': 'Технологии', 'slug': 'technology'},
            {'name': 'Мероприятия', 'slug': 'events'},
            {'name': 'Важное', 'slug': 'important'},
        ]

        tags = {}
        for tag_data in tags_data:
            tag, created = Tag.objects.get_or_create(
                slug=tag_data['slug'],
                defaults={'name': tag_data['name']}
            )
            tags[tag_data['slug']] = tag
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created tag: {tag_data["name"]}'))

        # Create sample blog posts
        admin = User.objects.get(email=admin_email)
        
        posts = [
            {
                'title': 'Добро пожаловать в YMIT!',
                'slug': 'welcome-to-ymit',
                'content': '''
# Добро пожаловать в YMIT!

Мы рады приветствовать вас на нашей платформе. YMIT - это место, где вы можете учиться, развиваться и достигать своих целей.

## Что вас ждет?

- **Качественное образование** - лучшие преподаватели и современные методики
- **Поддержка сообщества** - учитесь вместе с единомышленниками
- **Практические навыки** - применяйте знания на практике

Начните свой путь к успеху уже сегодня!
                ''',
                'excerpt': 'Добро пожаловать на платформу YMIT! Узнайте о наших возможностях.',
                'tags': ['news', 'important'],
                'status': Post.Status.PUBLISHED,
            },
            {
                'title': 'Как начать обучение на платформе',
                'slug': 'how-to-start-learning',
                'content': '''
# Как начать обучение на платформе

Начать обучение на YMIT очень просто! Следуйте этим шагам:

## Шаг 1: Регистрация

Создайте аккаунт на платформе, указав свой email и придумав надежный пароль.

## Шаг 2: Подтверждение email

Проверьте почту и подтвердите свой аккаунт.

## Шаг 3: Выбор курса

Выберите интересующий вас курс из нашего каталога.

## Шаг 4: Начните обучение!

Приступайте к изучению материалов в удобном для вас темпе.

**Удачи в обучении!**
                ''',
                'excerpt': 'Пошаговое руководство для новых пользователей платформы.',
                'tags': ['education'],
                'status': Post.Status.PUBLISHED,
            },
            {
                'title': 'Черновик поста',
                'slug': 'draft-post',
                'content': 'Это черновик поста, который еще не опубликован.',
                'excerpt': 'Черновик для тестирования.',
                'tags': ['news'],
                'status': Post.Status.DRAFT,
            },
        ]

        for post_data in posts:
            if not Post.objects.filter(slug=post_data['slug']).exists():
                post = Post.objects.create(
                    title=post_data['title'],
                    slug=post_data['slug'],
                    content=post_data['content'].strip(),
                    excerpt=post_data['excerpt'],
                    author=admin,
                    status=post_data['status'],
                    published_at=timezone.now() if post_data['status'] == Post.Status.PUBLISHED else None,
                )
                # Add tags
                for tag_slug in post_data.get('tags', []):
                    if tag_slug in tags:
                        post.tags.add(tags[tag_slug])
                self.stdout.write(self.style.SUCCESS(f'Created post: {post_data["title"]}'))

        self.stdout.write(self.style.SUCCESS('\nSeeding completed!'))
        self.stdout.write('\nTest accounts:')
        self.stdout.write('  Admin: admin@ymit.kz / Admin123!')
        self.stdout.write('  Member: member@ymit.kz / Test123!')
        self.stdout.write('  Student: student@ymit.kz / Test123!')
        self.stdout.write('  Unverified: new@ymit.kz / Test123!')
