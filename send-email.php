<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

/* =========================
   SANITIZE INPUTS
========================= */
$formType = trim(strip_tags($_POST['form_type'] ?? ''));

if ($formType === 'booking') {
    /* =========================
       BOOKING FORM HANDLING
    ========================= */
    $service = trim(strip_tags($_POST['service'] ?? ''));
    $vehicleSize = trim(strip_tags($_POST['vehicle_size'] ?? ''));
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = trim(strip_tags($_POST['telefon'] ?? ''));
    $notes = trim(strip_tags($_POST['nachricht'] ?? ''));
    
    /* =========================
       BOOKING VALIDATION
    ========================= */
    $errors = [];
    
    if (empty($service)) $errors[] = 'Service-Typ fehlt.';
    if (empty($vehicleSize)) $errors[] = 'Fahrzeuggröße fehlt.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Ungültige E-Mail-Adresse.';
    
    if ($errors) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => implode(' ', $errors)
        ]);
        exit;
    }
    
    // Format booking message
    $bookingMessage = "📅 Buchungsanfrage\n\n";
    $bookingMessage .= "Service: {$service}\n";
    $bookingMessage .= "Fahrzeuggröße: {$vehicleSize}\n";
    $bookingMessage .= "E-Mail: {$email}\n";
    if (!empty($phone)) {
        $bookingMessage .= "Telefon: {$phone}\n";
    }
    if (!empty($notes)) {
        $bookingMessage .= "\nZusätzliche Hinweise:\n{$notes}";
    }
    
    $firstName = '';
    $lastName = 'Buchungsanfrage';
    $message = $bookingMessage;
} else {
    /* =========================
       CONTACT FORM HANDLING
    ========================= */
    $firstName = trim(strip_tags($_POST['vorname'] ?? ''));
    $lastName  = trim(strip_tags($_POST['nachname'] ?? ''));
    $email     = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone     = trim(strip_tags($_POST['telefon'] ?? ''));
    $message   = trim(strip_tags($_POST['nachricht'] ?? ''));
    
    /* =========================
       CONTACT VALIDATION
    ========================= */
    $errors = [];
    
    if (strlen($firstName) < 2) $errors[] = 'Vorname fehlt.';
    if (strlen($lastName) < 2)  $errors[] = 'Nachname fehlt.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Ungültige E-Mail-Adresse.';
    if (strlen($message) < 10)  $errors[] = 'Nachricht zu kurz.';
    
    if ($errors) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => implode(' ', $errors)
        ]);
        exit;
    }
}

$mail = new PHPMailer(true);

try {
    if (!ob_get_level()) ob_start();

    /* =========================
       SMTP CONFIG (UNCHANGED)
    ========================= */
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'presslogic36@gmail.com';
    $mail->Password   = 'qsoz cpnl dvwd ibfs'; // App password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->SMTPDebug  = 0;

    /* =========================
       EMAIL HEADERS
    ========================= */
    $mail->setFrom('no-reply@charlysautosalon.de', 'Charlys Autosalon Website');
    $replyName = !empty($firstName) ? ($firstName . ' ' . $lastName) : $lastName;
    $mail->addReplyTo($email, $replyName);

    $mail->addAddress('kfz.bab@gmail.com');
    $mail->addAddress('altinejup@gmail.com');

    /* =========================
       EMAIL CONTENT
    ========================= */
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    
    if ($formType === 'booking') {
        $mail->Subject = '📅 Neue Buchungsanfrage – Website';
        
        // Format booking message for HTML
        $messageHtml = nl2br(htmlspecialchars($message));
        
        $mail->Body = "
        <div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;'>
            <div style='background:#111;color:#fff;padding:20px;text-align:center;'>
                <h2 style='margin:0;'>📅 Neue Buchungsanfrage</h2>
                <p style='margin:5px 0;font-size:13px;'>Website Formular</p>
            </div>

            <div style='padding:20px;color:#333;'>
                <div style='background:#f9f9f9;padding:15px;border-radius:6px;border:1px solid #eee;white-space:pre-line;'>
                    {$messageHtml}
                </div>
            </div>

            <div style='background:#f2f2f2;padding:10px;text-align:center;font-size:12px;color:#555;'>
                Gesendet am " . date('d.m.Y H:i:s') . "
            </div>
        </div>
        ";

        $mail->AltBody = $message;
    } else {
        $mail->Subject = '📩 Neue Kontaktanfrage – Website';

        $mail->Body = "
        <div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;'>
            <div style='background:#111;color:#fff;padding:20px;text-align:center;'>
                <h2 style='margin:0;'>Neue Kontaktanfrage</h2>
                <p style='margin:5px 0;font-size:13px;'>Website Formular</p>
            </div>

            <div style='padding:20px;color:#333;'>
                <p><strong>Name:</strong> {$firstName} {$lastName}</p>
                <p><strong>E-Mail:</strong> {$email}</p>
                " . (!empty($phone) ? "<p><strong>Telefon:</strong> {$phone}</p>" : "") . "
                <hr style='border:0;border-top:1px solid #eee;margin:15px 0;'>
                <p><strong>Nachricht:</strong></p>
                <div style='background:#f9f9f9;padding:12px;border-radius:6px;border:1px solid #eee;'>
                    {$message}
                </div>
            </div>

            <div style='background:#f2f2f2;padding:10px;text-align:center;font-size:12px;color:#555;'>
                Gesendet am " . date('d.m.Y H:i:s') . "
            </div>
        </div>
        ";

        $mail->AltBody =
            "Neue Kontaktanfrage\n\n" .
            "Name: {$firstName} {$lastName}\n" .
            "Email: {$email}\n" .
            (!empty($phone) ? "Telefon: {$phone}\n" : "") .
            "\nNachricht:\n{$message}";
    }

    $mail->send();

    if (ob_get_length()) ob_end_clean();

    echo json_encode([
        'success' => true,
        'message' => 'Ihre Nachricht wurde erfolgreich gesendet.'
    ]);

} catch (Exception $e) {
    error_log('Mailer Error: ' . $mail->ErrorInfo);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'E-Mail konnte nicht gesendet werden.'
    ]);
}
