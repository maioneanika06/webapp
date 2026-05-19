import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { organizerEmail, eventId } = await req.json();

        if (!organizerEmail || !eventId) {
            return NextResponse.json(
                { error: "organizerEmail and eventId are required" },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "https://vendywebapp.vercel.app";
        const registrationUrl = process.env.NEXT_PUBLIC_REGISTRATION_URL || "https://vendyregistrationform.vercel.app";

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: organizerEmail,
            subject: "Your Event Portal is Ready!",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #6b21a8;">Your Event Portal is Ready!</h2>
                    <p>Hello,</p>
                    <p>Your event has been successfully created. You can now access your dashboard and start managing your event.</p>
                    
                    <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #d946ef; background-color: #f3f4f6;">
                        <h3 style="margin-top: 0; color: #111827;">Admin Dashboard</h3>
                        <p>Log in here to manage your event, view attendees, and check inventory:</p>
                        <a href="${adminUrl}/login" style="color: #6b21a8; font-weight: bold;">${adminUrl}/login</a>
                    </div>
                    
                    <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #3b82f6; background-color: #f3f4f6;">
                        <h3 style="margin-top: 0; color: #111827;">Public Registration Link</h3>
                        <p>Share this exact URL with your attendees so they can register for the event:</p>
                        <a href="${registrationUrl}/?eventId=${eventId}" style="color: #3b82f6; font-weight: bold;">${registrationUrl}/?eventId=${eventId}</a>
                    </div>
                    
                    <p>If you have any questions, please contact the system administrator.</p>
                    <p>Best regards,<br/>VENDY</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error sending notification email:", error);
        return NextResponse.json(
            { error: "Failed to send notification email" },
            { status: 500 }
        );
    }
}
