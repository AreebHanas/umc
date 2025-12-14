-- ============================================
-- Utility Management System Database Schema
-- ============================================

-- Note: Database creation is handled by the environment
-- The migration script will use DB_NAME from .env

-- ============================================
-- 1. Users Table (Admin, Field Officers, Cashiers, Managers)
-- ============================================
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('Admin', 'FieldOfficer', 'Cashier', 'Manager') NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. Customers Table
-- ============================================
CREATE TABLE Customers (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Phone VARCHAR(15),
    CustomerType ENUM('Household', 'Business', 'Government') NOT NULL,
    RegisteredDate DATE DEFAULT (CURRENT_DATE)
);

-- ============================================
-- 3. Utility Types (Lookup table)
-- ============================================
CREATE TABLE UtilityTypes (
    UtilityTypeID INT AUTO_INCREMENT PRIMARY KEY,
    TypeName VARCHAR(20) NOT NULL UNIQUE,
    UnitOfMeasure VARCHAR(10) NOT NULL
);

-- ============================================
-- 4. Tariffs (Rate structure)
-- ============================================
CREATE TABLE Tariffs (
    TariffID INT AUTO_INCREMENT PRIMARY KEY,
    UtilityTypeID INT,
    CustomerType ENUM('Household', 'Business', 'Government'),
    RatePerUnit DECIMAL(10, 2) NOT NULL,
    FixedCharge DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (UtilityTypeID) REFERENCES UtilityTypes(UtilityTypeID)
);

-- ============================================
-- 5. Meters (Links Customer to Utility)
-- ============================================
CREATE TABLE Meters (
    MeterID INT AUTO_INCREMENT PRIMARY KEY,
    SerialNumber VARCHAR(50) NOT NULL UNIQUE,
    CustomerID INT,
    UtilityTypeID INT,
    InstallationDate DATE,
    Status ENUM('Active', 'Suspended') DEFAULT 'Active',
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    FOREIGN KEY (UtilityTypeID) REFERENCES UtilityTypes(UtilityTypeID)
);

-- ============================================
-- 6. Readings (Stores periodic meter data)
-- ============================================
CREATE TABLE Readings (
    ReadingID INT AUTO_INCREMENT PRIMARY KEY,
    MeterID INT,
    ReadingDate DATE NOT NULL,
    PreviousReading DECIMAL(10, 2) NOT NULL,
    CurrentReading DECIMAL(10, 2) NOT NULL,
    ReadingTakenBy INT,
    FOREIGN KEY (MeterID) REFERENCES Meters(MeterID),
    FOREIGN KEY (ReadingTakenBy) REFERENCES Users(UserID),
    CONSTRAINT chk_reading CHECK (CurrentReading >= PreviousReading)
);

-- ============================================
-- 7. Bills (Financial Records)
-- ============================================
CREATE TABLE Bills (
    BillID INT AUTO_INCREMENT PRIMARY KEY,
    ReadingID INT,
    BillDate DATE DEFAULT (CURRENT_DATE),
    UnitsConsumed DECIMAL(10, 2),
    TotalAmount DECIMAL(10, 2),
    DueDate DATE,
    Status ENUM('Unpaid', 'Paid', 'Overdue') DEFAULT 'Unpaid',
    FOREIGN KEY (ReadingID) REFERENCES Readings(ReadingID)
);

-- ============================================
-- 8. Payments (Transaction History)
-- ============================================
CREATE TABLE Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    BillID INT,
    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    AmountPaid DECIMAL(10, 2) NOT NULL,
    PaymentMethod ENUM('Cash', 'Card', 'Online') NOT NULL,
    ProcessedBy INT,
    FOREIGN KEY (BillID) REFERENCES Bills(BillID),
    FOREIGN KEY (ProcessedBy) REFERENCES Users(UserID)
);

-- ============================================
-- FUNCTION: Get Tariff Rate
-- ============================================
DELIMITER //

CREATE FUNCTION GetTariffRate(p_MeterID INT) 
RETURNS DECIMAL(10,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_Rate DECIMAL(10,2);
    
    SELECT t.RatePerUnit INTO v_Rate
    FROM Tariffs t
    JOIN Meters m ON t.UtilityTypeID = m.UtilityTypeID
    JOIN Customers c ON m.CustomerID = c.CustomerID
    WHERE m.MeterID = p_MeterID 
      AND t.CustomerType = c.CustomerType
    LIMIT 1;
    
    RETURN IFNULL(v_Rate, 0);
END //

DELIMITER ;

-- ============================================
-- TRIGGER: Auto-generate Bill after Reading
-- ============================================
DELIMITER //

CREATE TRIGGER After_Reading_Insert
AFTER INSERT ON Readings
FOR EACH ROW
BEGIN
    DECLARE v_Rate DECIMAL(10,2);
    DECLARE v_Units DECIMAL(10,2);
    DECLARE v_Total DECIMAL(10,2);
    
    -- 1. Calculate Units Consumed
    SET v_Units = NEW.CurrentReading - NEW.PreviousReading;
    
    -- 2. Get Tariff Rate
    SET v_Rate = GetTariffRate(NEW.MeterID);
    
    -- 3. Calculate Total Cost
    SET v_Total = (v_Units * v_Rate);
    
    -- 4. Create the Bill automatically
    INSERT INTO Bills (ReadingID, BillDate, UnitsConsumed, TotalAmount, DueDate, Status)
    VALUES (NEW.ReadingID, CURDATE(), v_Units, v_Total, DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Unpaid');
    
END //

DELIMITER ;

-- ============================================
-- VIEW: Unpaid Bills
-- ============================================
CREATE VIEW View_UnpaidBills AS
SELECT 
    c.CustomerID,
    c.FullName,
    c.Phone,
    u.TypeName AS Utility,
    b.BillID,
    b.TotalAmount,
    b.DueDate,
    DATEDIFF(CURDATE(), b.DueDate) AS DaysOverdue
FROM Bills b
JOIN Readings r ON b.ReadingID = r.ReadingID
JOIN Meters m ON r.MeterID = m.MeterID
JOIN Customers c ON m.CustomerID = c.CustomerID
JOIN UtilityTypes u ON m.UtilityTypeID = u.UtilityTypeID
WHERE b.Status = 'Unpaid';

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- 1. Insert Utility Types
INSERT INTO UtilityTypes (TypeName, UnitOfMeasure) VALUES 
('Electricity', 'kWh'), 
('Water', 'm3'),
('Gas', 'm3');

-- 2. Insert Tariffs
INSERT INTO Tariffs (UtilityTypeID, CustomerType, RatePerUnit, FixedCharge) VALUES 
(1, 'Household', 15.00, 100.00),
(1, 'Business', 20.00, 200.00),
(1, 'Government', 12.00, 150.00),
(2, 'Household', 50.00, 50.00),
(2, 'Business', 75.00, 100.00),
(2, 'Government', 40.00, 75.00);

-- 3. Insert Sample Users
INSERT INTO Users (Username, PasswordHash, Role) VALUES 
('admin', '$2a$10$rRmJHqVL3pGJnFJ.V3qR1.ZDdN0K5qf0Y3mLlKFqMV8L8Z8B5xDqS', 'Admin'),
('field_john', '$2a$10$rRmJHqVL3pGJnFJ.V3qR1.ZDdN0K5qf0Y3mLlKFqMV8L8Z8B5xDqS', 'FieldOfficer'),
('cashier_mary', '$2a$10$rRmJHqVL3pGJnFJ.V3qR1.ZDdN0K5qf0Y3mLlKFqMV8L8Z8B5xDqS', 'Cashier'),
('manager_bob', '$2a$10$rRmJHqVL3pGJnFJ.V3qR1.ZDdN0K5qf0Y3mLlKFqMV8L8Z8B5xDqS', 'Manager');
-- Note: All sample passwords are 'password123' (hashed)

-- 4. Insert Sample Customers
INSERT INTO Customers (FullName, Address, Phone, CustomerType) VALUES 
('John Doe', '123 Main St, Colombo', '0771234567', 'Household'),
('ABC Company Ltd', '456 Business Ave, Kandy', '0112345678', 'Business'),
('Government Hospital', '789 Health Rd, Galle', '0912345678', 'Government'),
('Jane Smith', '321 Park Lane, Jaffna', '0771234568', 'Household');

-- 5. Insert Sample Meters
INSERT INTO Meters (SerialNumber, CustomerID, UtilityTypeID, InstallationDate, Status) VALUES 
('ELEC-001', 1, 1, '2024-01-15', 'Active'),
('WATER-001', 1, 2, '2024-01-15', 'Active'),
('ELEC-002', 2, 1, '2024-02-01', 'Active'),
('WATER-002', 2, 2, '2024-02-01', 'Active'),
('ELEC-003', 3, 1, '2024-03-10', 'Active');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all tables
-- SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM Users
-- UNION ALL
-- SELECT 'Customers', COUNT(*) FROM Customers
-- UNION ALL
-- SELECT 'UtilityTypes', COUNT(*) FROM UtilityTypes
-- UNION ALL
-- SELECT 'Tariffs', COUNT(*) FROM Tariffs
-- UNION ALL
-- SELECT 'Meters', COUNT(*) FROM Meters
-- UNION ALL
-- SELECT 'Readings', COUNT(*) FROM Readings
-- UNION ALL
-- SELECT 'Bills', COUNT(*) FROM Bills
-- UNION ALL
-- SELECT 'Payments', COUNT(*) FROM Payments;

-- ============================================
-- CLEANUP (if needed)
-- ============================================
-- DROP DATABASE IF EXISTS UtilityDB;
