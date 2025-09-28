from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils import timezone
from .models import RegistrationCode

@admin.register(RegistrationCode)
class RegistrationCodeAdmin(admin.ModelAdmin):
    list_display = [
        'code', 'program_type', 'amount_currency', 'is_used', 'used_by', 
        'created_at', 'expires_at', 'status'
    ]
    list_filter = [
        'program_type', 'currency', 'is_used', 'created_at', 'expires_at'
    ]
    search_fields = ['code', 'used_by__email', 'used_by__full_name', 'notes']
    readonly_fields = ['code', 'created_at', 'used_at']
    fieldsets = [
        ('Code Information', {
            'fields': ['code', 'program_type', 'amount', 'currency']
        }),
        ('Usage Information', {
            'fields': ['is_used', 'used_by', 'used_at']
        }),
        ('Timing', {
            'fields': ['created_at', 'expires_at']
        }),
        ('Additional Info', {
            'fields': ['created_by', 'notes']
        })
    ]
    
    def amount_currency(self, obj):
        return f"{obj.currency} {obj.amount:,.2f}"
    amount_currency.short_description = 'Amount'
    
    def status(self, obj):
        if obj.is_used:
            return format_html('<span style="color: green;">✓ Used</span>')
        elif obj.is_expired():
            return format_html('<span style="color: red;">✗ Expired</span>')
        else:
            return format_html('<span style="color: blue;">○ Active</span>')
    status.short_description = 'Status'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('used_by', 'created_by')
    
    actions = ['mark_as_expired', 'generate_new_codes']
    
    def mark_as_expired(self, request, queryset):
        """Mark selected codes as expired"""
        count = 0
        for code in queryset:
            if not code.is_used:
                code.expires_at = timezone.now() - timezone.timedelta(seconds=1)
                code.save()
                count += 1
        
        self.message_user(request, f'{count} codes marked as expired.')
    mark_as_expired.short_description = 'Mark selected codes as expired'
    
    def generate_new_codes(self, request, queryset):
        """Generate new codes for selected program types"""
        # This would be implemented to generate multiple codes
        self.message_user(request, 'Code generation feature coming soon.')
    generate_new_codes.short_description = 'Generate new codes'