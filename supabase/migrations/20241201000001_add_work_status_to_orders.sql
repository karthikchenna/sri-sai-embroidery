-- Migration: Add work_status column to orders table
ALTER TABLE public.orders ADD COLUMN work_status VARCHAR(32) DEFAULT 'pending'; 