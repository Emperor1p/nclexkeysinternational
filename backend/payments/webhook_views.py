# payments/webhook_views.py
import json
import logging
import hmac
import hashlib
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings
from .models import Payment, PaymentGateway
from django.utils import timezone

logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(["POST"])
def paystack_webhook(request):
    """Handle Paystack webhooks for student registration payments"""
    try:
        # Verify webhook signature
        signature = request.headers.get('X-Paystack-Signature')
        if not signature:
            logger.error("Missing Paystack signature in webhook")
            return JsonResponse({'error': 'Missing signature'}, status=400)
        
        # Verify signature
        expected_signature = hmac.new(
            settings.PAYSTACK_SECRET_KEY.encode('utf-8'),
            request.body,
            hashlib.sha512
        ).hexdigest()
        
        if not hmac.compare_digest(signature, expected_signature):
            logger.error("Invalid Paystack signature in webhook")
            return JsonResponse({'error': 'Invalid signature'}, status=400)
        
        # Parse webhook data
        data = json.loads(request.body)
        event = data.get('event')
        
        logger.info(f"Paystack webhook received: {event}")
        
        if event == 'charge.success':
            # Handle successful payment - simplified without database dependencies
            payment_data = data.get('data', {})
            reference = payment_data.get('reference')
            
            logger.info(f"Payment successful via webhook: {reference}")
            logger.info(f"Payment data: {payment_data}")
            
            # Log successful payment for manual verification if needed
            # In production, you might want to store this in a simple log file or external service
            
            return JsonResponse({
                'status': 'success',
                'message': 'Payment webhook processed successfully',
                'reference': reference
            })
        
        elif event == 'charge.failed':
            # Handle failed payment - simplified without database dependencies
            payment_data = data.get('data', {})
            reference = payment_data.get('reference')
            
            logger.error(f"Payment failed via webhook: {reference}")
            logger.error(f"Failure reason: {payment_data.get('failure_reason', 'Unknown')}")
            
            return JsonResponse({
                'status': 'success',
                'message': 'Failed payment webhook processed',
                'reference': reference
            })
        
        else:
            logger.info(f"Ignoring webhook event: {event}")
            return JsonResponse({'status': 'ignored'})
            
    except Exception as e:
        logger.error(f"Webhook processing error: {str(e)}")
        return JsonResponse({'error': 'Internal server error'}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def flutterwave_webhook(request):
    """Handle Flutterwave webhooks"""
    try:
        # Verify webhook signature
        signature = request.headers.get('Verif-Hash')
        if not signature:
            return JsonResponse({'error': 'Missing signature'}, status=400)
        
        # Verify signature
        expected_signature = hmac.new(
            settings.FLUTTERWAVE_SECRET_KEY.encode('utf-8'),
            request.body,
            hashlib.sha512
        ).hexdigest()
        
        if not hmac.compare_digest(signature, expected_signature):
            return JsonResponse({'error': 'Invalid signature'}, status=400)
        
        # Parse webhook data
        data = json.loads(request.body)
        status = data.get('status')
        tx_ref = data.get('tx_ref')
        
        if status == 'successful':
            # Handle successful payment
            try:
                payment = Payment.objects.get(reference=tx_ref)
                payment.status = 'completed'
                payment.gateway_reference = data.get('id', '')
                payment.metadata = data
                payment.save()
                
                logger.info(f"Payment {tx_ref} marked as completed")
                return JsonResponse({'status': 'success'})
                
            except Payment.DoesNotExist:
                logger.error(f"Payment with reference {tx_ref} not found")
                return JsonResponse({'error': 'Payment not found'}, status=404)
        
        return JsonResponse({'status': 'ignored'})
        
    except Exception as e:
        logger.error(f"Flutterwave webhook error: {str(e)}")
        return JsonResponse({'error': 'Internal error'}, status=500)