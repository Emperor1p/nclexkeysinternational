from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
import uuid
import hashlib
import hmac
import time

User = get_user_model()

class EmailVerification(models.Model):
    """Model for managing email verification tokens"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='email_verification')
    token = models.CharField(max_length=100, unique=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField()
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Email verification for {self.user.email} - {'Verified' if self.is_verified else 'Pending'}"
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        return not self.is_verified and not self.is_expired()
    
    @classmethod
    def generate_token(cls):
        """Generate a secure verification token"""
        return str(uuid.uuid4())
    
    @classmethod
    def create_verification(cls, user, expires_in_hours=24):
        """Create email verification for user"""
        # Delete any existing verification
        cls.objects.filter(user=user).delete()
        
        token = cls.generate_token()
        expires_at = timezone.now() + timezone.timedelta(hours=expires_in_hours)
        
        return cls.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
    
    def send_verification_email(self):
        """Send verification email to user"""
        verification_url = f"{settings.FRONTEND_URL}/verify-email?token={self.token}"
        
        subject = "Verify Your Email - NCLEX Keys International"
        
        message = f"""
        Hello {self.user.full_name},
        
        Welcome to NCLEX Keys International! Please verify your email address to complete your registration.
        
        Click the link below to verify your email:
        {verification_url}
        
        This link will expire in 24 hours.
        
        If you didn't create an account with us, please ignore this email.
        
        Best regards,
        NCLEX Keys International Team
        """
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Email Verification</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to NCLEX Keys International!</h1>
                </div>
                <div class="content">
                    <h2>Hello {self.user.full_name},</h2>
                    <p>Thank you for registering with NCLEX Keys International. To complete your registration, please verify your email address.</p>
                    
                    <p>Click the button below to verify your email:</p>
                    <a href="{verification_url}" class="button">Verify Email Address</a>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">{verification_url}</p>
                    
                    <p><strong>This link will expire in 24 hours.</strong></p>
                    
                    <p>If you didn't create an account with us, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>NCLEX Keys International Team</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[self.user.email],
                html_message=html_message,
                fail_silently=False
            )
            return True
        except Exception as e:
            print(f"Error sending verification email: {e}")
            return False

class PasswordResetToken(models.Model):
    """Model for managing password reset tokens"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token = models.CharField(max_length=100, unique=True)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField()
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Password reset for {self.user.email} - {'Used' if self.is_used else 'Active'}"
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        return not self.is_used and not self.is_expired()
    
    @classmethod
    def generate_token(cls):
        """Generate a secure reset token"""
        return str(uuid.uuid4())
    
    @classmethod
    def create_reset_token(cls, user, expires_in_hours=1):
        """Create password reset token for user"""
        # Delete any existing tokens
        cls.objects.filter(user=user, is_used=False).delete()
        
        token = cls.generate_token()
        expires_at = timezone.now() + timezone.timedelta(hours=expires_in_hours)
        
        return cls.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
    
    def send_reset_email(self):
        """Send password reset email to user"""
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={self.token}"
        
        subject = "Reset Your Password - NCLEX Keys International"
        
        message = f"""
        Hello {self.user.full_name},
        
        You requested to reset your password for your NCLEX Keys International account.
        
        Click the link below to reset your password:
        {reset_url}
        
        This link will expire in 1 hour.
        
        If you didn't request this password reset, please ignore this email.
        
        Best regards,
        NCLEX Keys International Team
        """
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Password Reset</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
                .warning {{ background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <h2>Hello {self.user.full_name},</h2>
                    <p>You requested to reset your password for your NCLEX Keys International account.</p>
                    
                    <p>Click the button below to reset your password:</p>
                    <a href="{reset_url}" class="button">Reset Password</a>
                    
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">{reset_url}</p>
                    
                    <div class="warning">
                        <p><strong>⚠️ Important:</strong></p>
                        <ul>
                            <li>This link will expire in 1 hour</li>
                            <li>If you didn't request this reset, please ignore this email</li>
                            <li>Your password will remain unchanged until you click the link</li>
                        </ul>
                    </div>
                </div>
                <div class="footer">
                    <p>Best regards,<br>NCLEX Keys International Team</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[self.user.email],
                html_message=html_message,
                fail_silently=False
            )
            return True
        except Exception as e:
            print(f"Error sending reset email: {e}")
            return False
