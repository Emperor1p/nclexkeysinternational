-- Create payment_gateways table
CREATE TABLE IF NOT EXISTS payment_gateways (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    public_key VARCHAR(255),
    secret_key VARCHAR(255),
    webhook_secret VARCHAR(255),
    supported_currencies JSONB DEFAULT '[]',
    transaction_fee_percentage DECIMAL(5,4) DEFAULT 0.0150,
    transaction_fee_cap DECIMAL(10,2),
    supports_transfers BOOLEAN DEFAULT FALSE,
    minimum_transfer_amount DECIMAL(10,2) DEFAULT 1000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(100) UNIQUE NOT NULL,
    gateway_id UUID REFERENCES payment_gateways(id) ON DELETE RESTRICT,
    gateway_reference VARCHAR(255),
    user_id UUID REFERENCES users_user(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses_course(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    gateway_fee DECIMAL(10,2) DEFAULT 0.00,
    platform_fee DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    metadata JSONB DEFAULT '{}',
    authorization_code VARCHAR(255),
    card_type VARCHAR(20),
    last_4_digits VARCHAR(4),
    exp_month VARCHAR(2),
    exp_year VARCHAR(4),
    bank VARCHAR(100),
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    gateway_response JSONB DEFAULT '{}',
    failure_reason TEXT,
    callback_url VARCHAR(500),
    webhook_verified BOOLEAN DEFAULT FALSE,
    ip_address INET,
    user_agent TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
CREATE INDEX IF NOT EXISTS idx_payments_user_status ON payments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_course ON payments(course_id);
CREATE INDEX IF NOT EXISTS idx_payments_status_initiated ON payments(status, initiated_at);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_reference ON payments(gateway_reference);

-- Insert default Paystack gateway
INSERT INTO payment_gateways (
    name, display_name, is_active, is_default, 
    public_key, secret_key, webhook_secret,
    supported_currencies, transaction_fee_percentage, 
    transaction_fee_cap, supports_transfers, minimum_transfer_amount
) VALUES (
    'paystack', 'Paystack', TRUE, TRUE,
    'pk_live_9afe0ff4d8f81a67b5e799bd12a30551da1b0e19',
    'sk_live_your_live_paystack_secret_key_here',
    '',
    '["NGN", "USD", "GHS", "KES"]',
    0.0150,
    2000.00,
    TRUE,
    1000.00
) ON CONFLICT (name) DO UPDATE SET
    is_active = TRUE,
    is_default = TRUE,
    public_key = EXCLUDED.public_key,
    secret_key = EXCLUDED.secret_key,
    webhook_secret = EXCLUDED.webhook_secret,
    updated_at = NOW();
