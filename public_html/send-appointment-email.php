<?php
/**
 * Send Appointment Confirmation Email using PHPMailer
 * 
 * This script receives appointment booking data via POST
 * and sends a professional confirmation email to the patient.
 * From: info@drpraveenreddyortho.com
 * 
 * Requirements: composer require phpmailer/phpmailer
 */

require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Set response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request data']);
    exit;
}

// Extract and sanitize fields
$patientName = htmlspecialchars(trim($input['fullName'] ?? ''));
$patientEmail = filter_var(trim($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$mobile = htmlspecialchars(trim($input['mobile'] ?? ''));
$gender = htmlspecialchars(trim($input['gender'] ?? ''));
$age = intval($input['age'] ?? 0);
$appointmentDate = htmlspecialchars(trim($input['appointmentDate'] ?? ''));

// Validate required fields
if (!$patientEmail) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Valid email is required']);
    exit;
}

if (!$patientName) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Patient name is required']);
    exit;
}

// Format appointment date for display
$dateDisplay = $appointmentDate;
if ($appointmentDate) {
    try {
        $dateObj = new DateTime($appointmentDate);
        $dateDisplay = $dateObj->format('l, d F Y');
    } catch (Exception $e) {
        $dateDisplay = $appointmentDate;
    }
}

// ============================================================
// SMTP CONFIGURATION
// ============================================================
$smtpHost      = 'smtp.hostinger.com';
$smtpPort      = 465;
$smtpUsername   = 'appointments@drpraveenreddyortho.com';
$smtpPassword   = 'UnlockPage@123';
$fromEmail      = 'appointments@drpraveenreddyortho.com';
$fromName       = 'Dr. Praveen Reddy Ortho Clinic';

// Build the professional HTML email
$emailHTML = '
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Confirmation</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background-color:#f4f7fa;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f7fa; padding:30px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    
                    <!-- Header Banner -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #02015A 0%, #1a3a7a 100%); padding:35px 40px; text-align:center;">
                            <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:700; letter-spacing:0.5px;">
                                Dr. Praveen Reddy P
                            </h1>
                            <p style="color:#b8c9e8; margin:8px 0 0; font-size:14px; font-weight:400;">
                                MS Orthopaedics | Robotic Joint Replacement Surgeon
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Success Icon -->
                    <tr>
                        <td align="center" style="padding:30px 40px 10px;">
                            <div style="width:70px; height:70px; background:linear-gradient(135deg, #00b894, #00cec9); border-radius:50%; display:inline-block; line-height:70px; text-align:center;">
                                <span style="color:#ffffff; font-size:34px;">&#10003;</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Greeting -->
                    <tr>
                        <td style="padding:15px 40px 5px; text-align:center;">
                            <h2 style="color:#02015A; margin:0; font-size:22px; font-weight:700;">Appointment Confirmed!</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:5px 40px 25px; text-align:center;">
                            <p style="color:#666666; margin:0; font-size:15px; line-height:1.6;">
                                Dear <strong style="color:#333;">' . $patientName . '</strong>,<br>
                                Thank you for booking your appointment. Here are your booking details:
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Appointment Details Card -->
                    <tr>
                        <td style="padding:0 40px 25px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc; border-radius:10px; border:1px solid #e8edf2;">
                                <tr>
                                    <td style="padding:25px 30px;">
                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                            <!-- Patient Name -->
                                            <tr>
                                                <td style="padding:8px 0; border-bottom:1px solid #e8edf2;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td width="40%" style="color:#888; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Patient Name</td>
                                                            <td style="color:#333; font-size:15px; font-weight:600;">' . $patientName . '</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <!-- Appointment Date -->
                                            <tr>
                                                <td style="padding:8px 0; border-bottom:1px solid #e8edf2;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td width="40%" style="color:#888; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Appointment Date</td>
                                                            <td style="color:#02015A; font-size:15px; font-weight:700;">' . $dateDisplay . '</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <!-- Phone -->
                                            <tr>
                                                <td style="padding:8px 0; border-bottom:1px solid #e8edf2;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td width="40%" style="color:#888; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Phone</td>
                                                            <td style="color:#333; font-size:15px;">+91 ' . $mobile . '</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <!-- Gender -->
                                            <tr>
                                                <td style="padding:8px 0; border-bottom:1px solid #e8edf2;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td width="40%" style="color:#888; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Gender</td>
                                                            <td style="color:#333; font-size:15px;">' . $gender . '</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <!-- Age -->
                                            <tr>
                                                <td style="padding:8px 0;">
                                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tr>
                                                            <td width="40%" style="color:#888; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Age</td>
                                                            <td style="color:#333; font-size:15px;">' . $age . ' years</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Clinic Info -->
                    <tr>
                        <td style="padding:0 40px 25px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#fffbf0; border-radius:10px; border:1px solid #f0e6c8;">
                                <tr>
                                    <td style="padding:20px 25px;">
                                        <p style="color:#b8860b; margin:0 0 5px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">&#9201; Clinic Hours</p>
                                        <p style="color:#666; margin:0; font-size:14px; line-height:1.5;">
                                            <strong>Morning:</strong> 10:00 AM – 2:00 PM<br>
                                            <strong>Evening:</strong> 6:00 PM – 9:00 PM<br>
                                            <strong>Days:</strong> Sunday to Saturday
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Location -->
                    <tr>
                        <td style="padding:0 40px 25px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f0f7ff; border-radius:10px; border:1px solid #d0e3f7;">
                                <tr>
                                    <td style="padding:20px 25px;">
                                        <p style="color:#1a5276; margin:0 0 5px; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">&#128205; Clinic Location</p>
                                        <p style="color:#666; margin:0; font-size:14px; line-height:1.5;">
                                            Citizens Hospital, Sri Durga Enclave,<br>
                                            SBH Colony, LB Nagar, Hyderabad
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Important Notes -->
                    <tr>
                        <td style="padding:0 40px 30px;">
                            <p style="color:#888; margin:0; font-size:13px; line-height:1.6;">
                                <strong style="color:#666;">Important Notes:</strong><br>
                                &bull; Please arrive 10-15 minutes before your scheduled time.<br>
                                &bull; Carry any previous medical records or reports.<br>
                                &bull; For rescheduling or cancellation, contact us at least 24 hours in advance.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Contact CTA -->
                    <tr>
                        <td align="center" style="padding:0 40px 30px;">
                            <a href="tel:+919876543210" style="display:inline-block; background:linear-gradient(135deg, #02015A, #1a3a7a); color:#ffffff; text-decoration:none; padding:14px 35px; border-radius:8px; font-size:14px; font-weight:600; letter-spacing:0.5px;">
                                Contact Us for Any Queries
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f8fafc; padding:25px 40px; border-top:1px solid #e8edf2;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td align="center">
                                        <p style="color:#02015A; margin:0 0 5px; font-size:14px; font-weight:700;">Dr. Praveen Reddy P</p>
                                        <p style="color:#888; margin:0 0 3px; font-size:12px;">MS Orthopaedics | 22+ Years of Experience</p>
                                        <p style="color:#888; margin:0 0 12px; font-size:12px;">Robotic Knee & Hip Replacement Surgeon</p>
                                        <p style="color:#aaa; margin:0; font-size:11px;">
                                            &copy; ' . date('Y') . ' Dr. Praveen Reddy Ortho Clinic. All rights reserved.<br>
                                            This is an automated confirmation email. Please do not reply to this email.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

// ============================================================
// SEND EMAIL USING PHPMAILER
// ============================================================
$mail = new PHPMailer(true);

try {
    // SMTP Server settings
    $mail->isSMTP();
    $mail->Host       = $smtpHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpUsername;
    $mail->Password   = $smtpPassword;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = $smtpPort;

    // Sender & recipient
    $mail->setFrom($fromEmail, $fromName);
    $mail->addReplyTo($fromEmail, $fromName);
    $mail->addAddress($patientEmail, $patientName);

    // Email content
    $mail->isHTML(true);
    $mail->Subject = 'Appointment Confirmed – Dr. Praveen Reddy P | ' . $dateDisplay;
    $mail->Body    = $emailHTML;
    $mail->AltBody = "Appointment Confirmed!\n\n"
                   . "Dear $patientName,\n\n"
                   . "Your appointment has been booked successfully.\n\n"
                   . "Details:\n"
                   . "- Patient: $patientName\n"
                   . "- Date: $dateDisplay\n"
                   . "- Phone: +91 $mobile\n"
                   . "- Gender: $gender\n"
                   . "- Age: $age years\n\n"
                   . "Clinic Hours:\n"
                   . "Morning: 10:00 AM - 2:00 PM\n"
                   . "Evening: 6:00 PM - 9:00 PM\n\n"
                   . "Location: Citizens Hospital, Sri Durga Enclave, SBH Colony, LB Nagar, Hyderabad\n\n"
                   . "Please arrive 10-15 minutes before your scheduled time.\n"
                   . "Carry any previous medical records or reports.\n\n"
                   . "Dr. Praveen Reddy Ortho Clinic\n"
                   . "© " . date('Y') . " All rights reserved.";

    $mail->send();

    echo json_encode([
        'success' => true,
        'message' => 'Confirmation email sent successfully to ' . $patientEmail
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email: ' . $mail->ErrorInfo
    ]);
}
