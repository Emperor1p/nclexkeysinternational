# messaging/urls.py
from django.urls import path
from . import views

app_name = 'messaging'

urlpatterns = [
    # New Conversation-based messaging system
    path('conversations/', views.get_conversations, name='get_conversations'),
    path('conversations/create/', views.create_conversation, name='create_conversation'),
    path('conversations/<uuid:conversation_id>/', views.get_conversation, name='get_conversation'),
    path('conversations/<uuid:conversation_id>/messages/', views.get_messages, name='get_messages'),
    path('conversations/<uuid:conversation_id>/send/', views.send_message, name='send_message'),
    path('conversations/<uuid:conversation_id>/read/', views.mark_conversation_read, name='mark_conversation_read'),
    path('unread-count/', views.get_unread_count, name='get_unread_count'),
    
    # Message management
    path('messages/<uuid:message_id>/', views.message_detail, name='message_detail'),
    path('messages/<uuid:message_id>/read/', views.mark_message_read, name='mark_message_read'),
    
    # User status and typing
    path('user/status/', views.user_status, name='user_status'),
    path('conversations/<uuid:conversation_id>/typing/', views.set_typing_status, name='set_typing_status'),
    path('conversations/<uuid:conversation_id>/online-users/', views.get_online_users, name='get_online_users'),
    
    # Invitations
    path('invitations/', views.get_invitations, name='get_invitations'),
    path('invitations/<uuid:invitation_id>/accept/', views.accept_invitation, name='accept_invitation'),
    path('invitations/<uuid:invitation_id>/decline/', views.decline_invitation, name='decline_invitation'),
    
    # Legacy messaging system (keeping for backward compatibility)
    path('messages/', views.get_messages_legacy, name='get_messages_legacy'),
    path('send/', views.send_message_legacy, name='send_message_legacy'),
    
    # Notifications
    path('notifications/', views.get_notifications, name='get_notifications'),
    path('notifications/<uuid:notification_id>/read/', views.mark_notification_read, name='mark_notification_read'),
]
