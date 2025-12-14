-- ============================================
-- Script to disable automatic bill generation trigger
-- ============================================
-- Run this script in your MySQL database to prevent
-- automatic bill creation when inserting readings

-- Drop the existing trigger
DROP TRIGGER IF EXISTS After_Reading_Insert;

-- Now readings will be inserted without auto-generating bills
-- Bills must be created manually or through a separate process
