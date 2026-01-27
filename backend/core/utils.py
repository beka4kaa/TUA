import re
import hashlib


def generate_slug(title: str) -> str:
    """Generate URL-friendly slug from title"""
    slug = title.lower().strip()
    # Remove special characters
    slug = re.sub(r'[^\w\s-]', '', slug)
    # Replace spaces with hyphens
    slug = re.sub(r'\s+', '-', slug)
    # Replace multiple hyphens with single
    slug = re.sub(r'-+', '-', slug)
    # Limit length
    return slug[:100]


def calculate_reading_time(content: str) -> int:
    """Calculate reading time in minutes based on word count"""
    words_per_minute = 200
    word_count = len(content.split())
    minutes = word_count // words_per_minute
    return max(1, minutes)


def hash_ip(ip_address: str) -> str:
    """Hash IP address for anonymous tracking"""
    return hashlib.sha256(ip_address.encode()).hexdigest()[:32]
